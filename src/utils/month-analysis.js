import axios from 'axios';

export async function fetchTradeData(userId) {
  try {
    const response = await axios.get(
      `http://localhost:3000/tradeTotal?userId=${userId}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching trade data:', error);
    return [];
  }
}

export function calculateMonthlySpending(data, userId) {
  const monthlySpending = {};

  data.forEach((trade) => {
    if (trade.userId === userId) {
      const month = trade.tradeTotalMonth;
      if (!monthlySpending[month]) {
        monthlySpending[month] = 0;
      }
      monthlySpending[month] += trade.tradeTotalAmount;
    }
  });

  return Object.keys(monthlySpending)
    .sort((a, b) => a - b)
    .map((month) => ({
      month: parseInt(month),
      total: monthlySpending[month],
    }));
}

export function renderChart(ctx, monthlyData) {
  const labels = monthlyData.map((data) => `${data.month}월`);
  const values = monthlyData.map((data) => data.total);

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        {
          label: '월별 지출 금액',
          data: values,
          borderColor: '#FF8A3D',
          backgroundColor: 'rgba(255, 138, 61, 0.8)', // #FF8A3D 에 alpha 값 넣은 것
          borderWidth: 1,
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: '월별 지출 현황',
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: '월',
          },
        },
        y: {
          title: {
            display: true,
            text: '지출 금액 (원)',
          },
          beginAtZero: true,
        },
      },
    },
  });
}
