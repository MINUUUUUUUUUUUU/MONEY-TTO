<template>
  <nav
    class="navbar"
    :class="{ 'bg-carrot': isHome, 'bg-white border-bottom': !isHome }"
  >
    <div class="container-fluid position-relative">
      <!-- 중앙 타이틀 -->
      <RouterLink
        to="/"
        class="navbar-brand position-absolute top-50 start-50 translate-middle fw-bold"
        :class="isHome ? 'text-white' : 'carrot'"
      >
        <i class="fa-solid fa-carrot"></i> 머니또
      </RouterLink>

      <!-- 햄버거 버튼 (login, register에서는 안 보이지만 공간은 유지) -->
      <button
        class="navbar-toggler ms-auto"
        :class="[
          isHome ? 'custom-toggler' : 'custom-toggler-orange',
          !showHamburger && 'invisible',
        ]"
        @click="openOffcanvas"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
    </div>

    <!-- 오프캔버스(메뉴 바) -->
    <div
      v-if="isNavShow"
      class="offcanvas-backdrop pointer"
      @click.self="closeOffcanvas"
    >
      <div
        class="offcanvas offcanvas-end show"
        style="width: 250px"
        @click.stop
      >
        <div
          class="offcanvas-header d-flex justify-content-between align-items-center p-3 border-bottom"
        >
          <!-- 닫기 버튼 -->
          <button class="btn btn-sm" @click="closeOffcanvas">✕</button>
          <!-- 홈 버튼 -->
          <RouterLink
            to="/"
            class="btn btn-sm btn-outline-light"
            @click="closeOffcanvas"
          >
            <i class="fas fa-home carrot" style="font-size: 1.5rem"></i>
          </RouterLink>
        </div>

        <!-- 오프캔버스 내부 -->
        <div class="offcanvas-body p-3 d-flex flex-column">
          <!-- 사용자 정보 -->
          <div class="my-2 text-center fs-2 fw-semibold">{{ userName }}</div>
          <hr />
          <!-- 이번 달 총액 -->
          <div class="my-4 text-center">
            <div :class="['fs-4 fw-bold', monthlyTotalColorClass]">
              {{ formattedMonthlyTotal }} 원
            </div>
            <div>이번 달 총액</div>
          </div>

          <hr />
          <!-- 전체 내역 조회 -->
          <div class="my-3">
            <RouterLink
              class="d-flex justify-content-between align-items-center text-decoration-none text-black px-3"
              to="/trade"
              @click="closeOffcanvas"
            >
              <span>전체 내역 조회</span>
              <i class="fa-solid fa-chevron-right"></i>
            </RouterLink>
          </div>
          <hr />
          <!-- 개인 정보 수정, 지출/소비 추가 -->
          <ul
            class="d-flex justify-content-around align-items-center list-unstyled mt-4"
          >
            <li class="text-center d-flex flex-column align-items-center">
              <RouterLink
                class="text-decoration-none text-black"
                to="/profile/edit"
                @click="closeOffcanvas"
              >
                <i
                  class="fa-solid fa-user-gear mb-1"
                  style="font-size: 2rem"
                ></i>
                <p class="mb-0" style="font-size: 0.75rem">개인정보 수정</p>
              </RouterLink>
            </li>
            <li class="text-center d-flex flex-column align-items-center">
              <RouterLink
                class="text-decoration-none text-black"
                to="/trade/add"
                @click="closeOffcanvas"
              >
                <i
                  class="fa-solid fa-circle-plus carrot mb-1"
                  style="font-size: 2rem"
                ></i>
                <p class="mb-0" style="font-size: 0.75rem">지출/소비 추가</p>
              </RouterLink>
            </li>
          </ul>
          <!-- 로그아웃 -->
          <a
            href="#"
            class="mb-3 text-center text-black"
            style="font-size: 0.75rem"
            @click="handleLogout"
          >
            로그아웃
          </a>

          <!-- 하단 배너 광고, 클릭 시 kb국민은행 홈페이지로 이동 -->
          <div class="mt-auto">
            <a
              href="https://www.kbstar.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="../assets/kb_advertisement.jpg"
                alt="광고"
                class="img-fluid w-100"
              />
            </a>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import { useRoute } from 'vue-router';
import { useUserStore } from '@/stores/user-store';

const route = useRoute();

const userStore = useUserStore();

// 홈 화면인지 확인하는 변수
const isHome = computed(() => route.path === '/');
// 현재 경로가 /login, /register 인지 확인해서 햄버거 버튼 숨김
const showHamburger = computed(() => {
  return !['/login', '/register'].includes(route.path);
});

const isNavShow = ref(false);
const userName = ref('');
const monthlyTotal = ref(0);

// 금액 포맷 맞추기(3자리 수마다 콤마 추가)
const formattedMonthlyTotal = computed(() => {
  return monthlyTotal.value.toLocaleString('ko-KR');
});

// 메뉴 바 열기
const openOffcanvas = () => {
  isNavShow.value = true;
};
// 메뉴 바 닫기
const closeOffcanvas = () => {
  isNavShow.value = false;
};

// 현재 월(Month) 계산
const currentMonth = new Date().getMonth() + 1;

// 임의로 user 지정, 로그인 기능 구현 시, 수정 필요
const userId = userStore.userId;

onMounted(async () => {
  try {
    // user 데이터 받아오기
    const { data } = await axios.get(
      `http://localhost:3000/users?userId=${userId}`
    );
    userName.value = data[0]?.nickname ?? '이름 없음';

    // tradeTotal 데이터 받아오기
    const { data: tradeList } = await axios.get(
      `http://localhost:3000/tradeList?userId=${userId}`
    );

    // 현재 월에 맞는 total 금액 찾기
    const totalAmountForCurrentMonth = tradeList
      .filter((trade) => {
        const tradeMonth = new Date(trade.tradeDate).getMonth() + 1;
        return tradeMonth === currentMonth;
      })
      .reduce((sum, trade) => {
        if (trade.tradeType === '수입') {
          return sum + trade.tradeAmount;
        } else if (trade.tradeType === '지출') {
          return sum - trade.tradeAmount;
        }
        return sum;
      }, 0);

    monthlyTotal.value = totalAmountForCurrentMonth;
  } catch (err) {
    console.error('데이터 불러오기 실패:', err);
  }
});

// 양수면 초록, 음수면 주황색으로 폰트 색상 변경
const monthlyTotalColorClass = computed(() => {
  return monthlyTotal.value < 0 ? 'carrot' : 'green';
});

const handleLogout = () => {
  closeOffcanvas();
  userStore.logout();
};
</script>

<style scoped>
.navbar-brand {
  text-decoration: none;
}

.navbar-brand:hover {
  text-decoration: none;
}

.navbar-brand {
  text-decoration: none;
  color: inherit; /* 기본 색상 유지 */
}

.navbar-brand:focus,
.navbar-brand:active {
  color: inherit;
  outline: none;
  text-decoration: none;
}
.navbar-brand.carrot:focus,
.navbar-brand.carrot:active {
  color: #ff8a3d !important;
}

/* 홈 화면이 아닐 때 carrot 색상 유지 */
.navbar-brand.carrot:hover {
  color: #ff8a3d !important;
}

/* 햄버거 아이콘 흰색 */
.custom-toggler .navbar-toggler-icon {
  background-image: url("data:image/svg+xml;charset=utf8,%3Csvg viewBox='0 0 30 30' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath stroke='white' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3E%3C/svg%3E");
}

/* 햄버거 아이콘 주황색 */
.custom-toggler-orange .navbar-toggler-icon {
  background-image: url("data:image/svg+xml;charset=utf8,%3Csvg viewBox='0 0 30 30' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath stroke='%23ff8a3d' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3E%3C/svg%3E");
}

/* 오프캔버스 외부 배경 */
.offcanvas-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1040;
  display: flex;
  justify-content: flex-end;
}

/* 실제 오프캔버스 박스 */
.offcanvas {
  background-color: white;
  height: 100%;
  z-index: 1045;
}
.carrot {
  color: #ff8a3d;
}
.bg-carrot {
  background-color: #ff8a3d;
}
.green {
  color: #339f46;
}
.pointer {
  cursor: pointer;
}
</style>
