// ** Axios client import
import axiosClient from '../auth/jwtService'

// ** Constants import
import { endPointConstant } from '../constants'

export const userApi = {
  profile: (id: string) => axiosClient.get(`${endPointConstant.BASE_URL}/user/profile/${id}`),
  editProfile: (data: any) => axiosClient.put(`${endPointConstant.BASE_URL}/user/editProfile`, data),
  getFollowers: (id: string) => axiosClient.get(`${endPointConstant.BASE_URL}/user/getFollowers/${id}`),
  getFollowing: (id: string) => axiosClient.get(`${endPointConstant.BASE_URL}/user/getFollowing/${id}`),
  follow: (id: string) => axiosClient.post(`${endPointConstant.BASE_URL}/user/follow/${id}`),
}
