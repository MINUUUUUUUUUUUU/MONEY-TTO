import axios from 'axios';

const API_URL = 'http://localhost:3000'; // 로컬 json-server 도메인

export const login = async (email, password) => {
  try {
    // users 엔드포인트에서 모든 사용자 정보 가져오기
    const response = await axios.get(`${API_URL}/users`);
    const users = response.data;

    // 입력된 이메일과 비밀번호가 일치하는 사용자 찾기
    const user = users.find(
      (user) => user.email === email && user.password === password
    );

    if (user) {
      // 로그인 성공: 세션 스토리지에 사용자 ID 저장
      sessionStorage.setItem('userId', user.id);
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
    // 서버 오류 처리
    return {
      success: false,
      message: '서버 오류가 발생했습니다. 다시 시도해주세요.',
    };
  }
};

export const register = async ({ email, password, nickname, age, userId }) => {
  try {
    // 먼저 중복 사용자 체크
    const response = await axios.get(`${API_URL}/users`);
    const users = response.data;

    const emailExists = users.some((user) => user.email === email);
    const userIdExists = users.some((user) => user.userId === userId);

    if (emailExists) {
      return {
        success: false,
        message: '이미 존재하는 이메일입니다.',
      };
    }

    if (userIdExists) {
      return {
        success: false,
        message: '이미 존재하는 아이디입니다.',
      };
    }

    // 중복이 아니라면 사용자 등록 요청
    const newUser = {
      email,
      password,
      nickname,
      age,
      userId,
      id: crypto.randomUUID(), // 고유 ID 생성 (JSON Server 용)
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
