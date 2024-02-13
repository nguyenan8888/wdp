// ** Axios client import
import axiosClient from '../auth/jwtService';

// ** Constants import
import { endPointConstant } from '../constants';

type Post = {
  user: string;
  content: string;
  images: string[];
  is_public: boolean;
};

export const postApi = {
  create_post: (data: Post) => {
    return axiosClient.post(`${endPointConstant.BASE_URL}/post/createPost`, data);
  },

  get_posts:()=> {
    return axiosClient.get(`${endPointConstant.BASE_URL}/post/personalPosts`);
  },

  get_postDetails: (postId: string) => {
    return axiosClient.get(`${endPointConstant.BASE_URL}/post/postDetail/${postId}`);
  },

  edit_post: (postId: string, data:Post) => {
    return axiosClient.put(`${endPointConstant.BASE_URL}/post/editPost/${postId}`,data);
  },
  newFeed: () => axiosClient.get(`${endPointConstant.BASE_URL}/post/getPosts`),
};
