import axios from 'axios';

const API_URL = '/api'; // 로컬 json-server 도메인

export const login = async (email, password) => {
  try {
    // users 엔드포인트에서 모든 사용자 정보 가져오기
    const response = await axios.get(`/api/users`);
    const users = response.data;

    console.log(users);

    // 입력된 이메일과 비밀번호가 일치하는 사용자 찾기
    const user = users.find(
      (user) => user.email === email && user.password === password
    );

    if (user) {
      // 로그인 성공: 세션 스토리지에 사용자 ID 저장
      sessionStorage.setItem('userId', user.userId);
      return {
        userId: user.userId,
        email: email,
        nickname: user.nickname,
        age: user.age,
        success: true,
      };
    } else {
      // 로그인 실패: 일치하는 사용자 없음
      return {
        success: false,
        message: '이메일 또는 비밀번호가 잘못되었습니다.',
      };
    }
  } catch (error) {
    console.log(error.message);
    // 서버 오류 처리
    return {
      success: false,
      message: '서버 오류가 발생했습니다. 다시 시도해주세요.',
    };
  }
};

export const emailCheck = async (email) => {
  // 이메일 형식 정규식
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // 형식이 올바르지 않은 경우
  if (!emailRegex.test(email)) {
    return {
      success: false,
      message: '올바른 이메일 형식이 아닙니다.',
    };
  }

  try {
    const response = await axios.get(`${API_URL}/users`);
    const users = response.data;

    const emailExists = users.some((user) => user.email === email);
    if (emailExists) {
      return {
        success: false,
        message: '이미 존재하는 이메일입니다.',
      };
    } else {
      return {
        success: true,
        message: '사용 가능한 이메일입니다.',
      };
    }
  } catch (error) {
    return {
      success: false,
      message: '이메일 확인 중 오류가 발생했습니다.',
    };
  }
};

export const register = async ({ email, password, nickname, age, userId }) => {
  try {
    // 이메일 형식 유효성 검사
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        success: false,
        message: '올바른 이메일 형식이 아닙니다.',
      };
    }

    //. 중복 사용자 체크
    const response = await axios.get(`${API_URL}/users`);
    const users = response.data;

    const emailExists = users.some((user) => user.email === email);
    if (emailExists) {
      return {
        success: false,
        message: '이미 존재하는 이메일입니다.',
      };
    }

    // 3. 사용자 등록
    const newUser = {
      email,
      password,
      nickname,
      age,
      userId,
    };

    await axios.post(`${API_URL}/users`, newUser);

    return {
      success: true,
      message: '회원가입이 완료되었습니다.',
    };
  } catch (error) {
    return {
      success: false,
      message: '회원가입 중 오류가 발생했습니다.',
    };
  }
};
