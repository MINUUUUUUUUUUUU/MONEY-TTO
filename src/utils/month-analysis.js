import axios from 'axios';

export async function fetchTradeData(userId) {
  try {
    const response = await axios.get(
      `http://localhost:3000/tradeList?userId=${userId}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching trade data:', error);
    return [];
  }
}

export function calculateMonthlySpending(data) {
  const monthlyData = {};

  data.forEach((trade) => {
    const month = new Date(trade.tradeDate).getMonth() + 1; // 월 추출 (1부터 12까지)
    const type = trade.tradeType; // '수입' 또는 '지출'
    const amount = trade.tradeAmount;

    if (!monthlyData[month]) {
      monthlyData[month] = { 수입: 0, 지출: 0 };
    }

    if (type === '수입' || type === '지출') {
      monthlyData[month][type] += amount;
    } else {
      console.warn(`알 수 없는 거래 유형: ${trade.tradeType}`);
    }
  });

  const sortedMonths = Object.keys(monthlyData).sort((a, b) => a - b);

  const incomeData = sortedMonths.map((month) => ({
    month: parseInt(month),
    total: monthlyData[month]['수입'],
  }));

  const expenseData = sortedMonths.map((month) => ({
    month: parseInt(month),
    total: monthlyData[month]['지출'],
  }));
  return { incomeData, expenseData };
}

export function renderChart(ctx, incomeData, expenseData) {
  const labels = incomeData.map((data) => `${data.month}월`);

  const incomeValues = incomeData.map((data) => data.total);
  const expenseValues = expenseData.map((data) => data.total);

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        {
          label: '월별 수입 금액',
          data: incomeValues,
          backgroundColor: 'rgba(75, 192, 192, 0.8)', // 청록색
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
        {
          label: '월별 지출 금액',
          data: expenseValues,
          backgroundColor: 'rgba(255, 99, 132, 0.8)', // 빨간색
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: '월별 수입 및 지출 현황',
        },
      },
      scales: {
        x: {
          title: {
            display: true,
          },
          stacked: false, // 그룹화된 막대를 위해 false로 설정
        },
        y: {
          title: {
            display: true,
            text: '금액 (원)',
          },
          beginAtZero: true,
        },
      },
    },
  });
}
