import axios from "../http"; // 导入http中创建的axios实例
import qs from "qs"; // 根据需求是否导入qs模块

const getBook = {
  //获取音频列表
  getAudioList(params) {
    return axios.post(`/mobile/audio/lists`,qs.stringify(params));
  },
  //获取随机音频列表
  getLike(params) {
    return axios.post(`mobile/audio/lists_tj`,qs.stringify(params));
  },
  //获取音频详情
  getAudioDetail(params){
    return axios.post(`mobile/audio/info`,qs.stringify(params));
  },
  // 收藏音频
  collectAudio(params){
    return axios.post(`mobile/audio/collect`,qs.stringify(params));
  },
  // 取消收藏音频
  cancelCollectAudio(params){
    return axios.post(`mobile/audio/del_collect`,qs.stringify(params));
  },
  // 评论音频
  commentAudio(params){
    return axios.post(`mobile/audio/comment`,qs.stringify(params));
  },
  // 评论音频列表
  getComentList(params){
    return axios.post(`mobile/audio/comment_lists`,qs.stringify(params));
  },
  // 点赞音频
  likeAudio(params){
    return axios.post(`mobile/audio/likes`,qs.stringify(params));
  },
  // 下单购买音频
  buyAudio(params){
    return axios.post(`mobile/audio/order`,qs.stringify(params));
  },
  // 收藏音频列表
  collectAudioList(params){
    return axios.post(`mobile/audio/collect_lists`,qs.stringify(params));
  },
  
  // 获取小说列表
  getBookList(params){
    return axios.post(`mobile/fiction/lists`,qs.stringify(params));
  },
  //获取随机小说列表
  getBookLike(params) {
    return axios.post(`mobile/fiction/lists_tj`,qs.stringify(params));
  },
  //获取小说详情
  getBookDetail(params){
    return axios.post(`mobile/fiction/info`,qs.stringify(params));
  },
  //获取小说章节列表
  getBookChapter(params){
    return axios.post(`mobile/fiction/info_stage`,qs.stringify(params));
  },
  // 收藏小说
  collectBook(params){
    return axios.post(`mobile/fiction/collect`,qs.stringify(params));
  },
  // 取消收藏小说
  cancelCollectBook(params){
    return axios.post(`mobile/fiction/del_collect`,qs.stringify(params));
  },
  // 下单购买小说
  buyBook(params){
    return axios.post(`mobile/fiction/order`,qs.stringify(params));
  },
  // 收藏小说列表
  collectBookList(params){
    return axios.post(`mobile/fiction/collect_lists`,qs.stringify(params));
  },
  
  // 获取人物主页信息
  getCharacter(params){
    return axios.post(`mobile/character/info`,qs.stringify(params));
  },
  // 关注人物
  followCharacter(params) {
    return axios.post(`mobile/character/collect`,qs.stringify(params));
  },
  // 取消关注人物
  cancelCharacter(params){
    return axios.post(`mobile/character/del_collect`,qs.stringify(params));
  },
  // 获取我关注的人物
  getMyFollow(params){
    return axios.post(`mobile/character/collect_lists`,qs.stringify(params));
  },
  
  // 收藏课程列表
  collectLessonList(params){
    return axios.post(`mobile/lesson/collect_lists`,qs.stringify(params));
  },
}

export default getBook;