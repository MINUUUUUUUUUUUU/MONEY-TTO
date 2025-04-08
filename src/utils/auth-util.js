import axios from 'axios';

export const login = async (email, password) => {
  try {
    const response = await axios.post('/api/login', {
      email: email,
      password: password,
    });

    if (response.data.token) {
      sessionStorage.setItem('authToken', response.data.token);
      return { success: true };
    } else {
      return { success: false, message: '토큰이 제공되지 않았습니다.' };
    }
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.message || '로그인 중 오류가 발생했습니다.',
    };
  }
};
