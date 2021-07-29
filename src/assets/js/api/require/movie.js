//电影
import axios from "../http"; // 导入http中创建的axios实例
import qs from "qs"; // 根据需求是否导入qs模块

const getMovie = {
  get_indexmovie(params) {
    return axios.post(`/mobile/movies/index`, qs.stringify(params));
  },
  get_moviecate(params) {
    return axios.post(`/mobile/movies/movies_type_query`, qs.stringify(params));
  },
  search_movie(params) {
    return axios.post(`/mobile/movies/type_query`, qs.stringify(params));
  },
  get_movieDeatil(params) {
    return axios.post(`/mobile/movies/movies_son`, qs.stringify(params));
  },
  get_randomMovie(params) {
    return axios.post(`/mobile/movies/random_movies`, qs.stringify(params));
  },
  get_movie_recommend(params) {
    return axios.post(`/mobile/movies/index`, qs.stringify(params));
  },
  get_movie_detail(params) {
    return axios.post(`/mobile/movies/movies_son`, qs.stringify(params));
  },
  like_movie_btn(params) {
    return axios.post(`/mobile/movies/movies_like`, qs.stringify(params));
  },
};

export default getMovie;
