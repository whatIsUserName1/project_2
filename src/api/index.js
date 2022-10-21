import request from '@/utils/request.js'
export const getRequest = function () {
  return request.post('/api/reg', {
    data: {
      username: 'wwygddqxgbfm',
      password: '123456',
      repassword: '123456'
    }
  })
}
