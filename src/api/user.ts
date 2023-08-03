import request from "@/utils/request";

/**
 * @description:
 * @return {*}
 * 4. 获取登录状态和用户信息
 * 登录状态
 * 说明 : 调用此接口,可获取登录状态
 * 接口地址 : /login/status
 * 获取用户详情
 * 说明 : 登录后调用此接口 , 传入用户 id, 可以获取用户详情
 * 必选参数 : uid : 用户 id
 * 接口地址 : /user/detail
 * 调用例子 : /user/detail?uid=32953014
 */
export interface LoginStatus {
  profile: {
    userId: string;
  };
}
export function getLoginStatusAPI() {
  return new Promise((resolve, reject) => {
    request({
      method: "get",
      url: "/login/status",
      params: {
        timestamp: new Date().getTime(),
      },
    })
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}
/**
 * @description:
 * @return {*}
 * 获取用户详情
 * 说明 : 登录后调用此接口 , 传入用户 id, 可以获取用户详情
 * 必选参数 : uid : 用户 id
 * 接口地址 : /user/detail
 * 调用例子 : /user/detail?uid=32953014
 */
export function getUserDetailAPI(uid: number) {
  return request({
    url: "/user/detail",
    params: {
      uid,
      timestamp: new Date().getTime(),
    },
  });
}
/**
 * @description:
 * @return {*}
 * 获取账号信息
 * 说明 : 登录后调用此接口 ,可获取用户账号信息
 * 接口地址 : /user/account
 * 调用例子 : /user/account
 */
export function getUserAccountAPI() {
  return request({
    url: "/user/account",
    params: {
      timestamp: new Date().getTime(),
    },
  });
}
/**
 * @description:
 * @return {*}
 * 获取用户信息 , 歌单，收藏，mv, dj 数量
 * 说明 : 登录后调用此接口 , 可以获取用户信息
 * 接口地址 : /user/subcount
 * 调用例子 : /user/subcount
 */
export function getUserSubcountAPI() {
  return request({
    url: "/user/subcount",
    params: {
      timestamp: new Date().getTime(),
    },
  });
}
/**
 * @description:
 * @return {*}
 * 喜欢音乐列表
 * 说明 : 调用此接口 , 传入用户 id, 可获取已喜欢音乐 id 列表(id 数组)
 * 必选参数 : uid: 用户 id
 * 接口地址 : /likelist
 * 调用例子 : /likelist?uid=32953014
 */
export function getUserLikeListAPI(uid: number) {
  return request({
    url: "/likelist",
    params: {
      uid,
      timestamp: new Date().getTime(),
    },
  });
}
/**
 * @description:
 * @return {*}
 * 获取用户歌单
 * 说明 : 登录后调用此接口 , 传入用户 id, 可以获取用户歌单
 * 必选参数 : uid : 用户 id
 * 可选参数 :
 * limit : 返回数量 , 默认为 30
 * offset : 偏移数量，用于分页 , 如 :( 页数 -1)*30, 其中 30 为 limit 的值 , 默认为 0
 * 接口地址 : /user/playlist
 * 调用例子 : /user/playlist?uid=32953014
 */
export function getUserPlaylistAPI(uid: number) {
  return request({
    url: "/user/playlist",
    params: {
      uid,
      timestamp: new Date().getTime(),
    },
  });
}
/**
 * @description:
 * @return {*}
 * 获取已收藏专辑列表
 * 说明 : 调用此接口 , 可获得已收藏专辑列表
 * 可选参数 :
 * limit: 取出数量 , 默认为 25
 * offset: 偏移数量 , 用于分页 , 如 :( 页数 -1)*25, 其中 25 为 limit 的值 , 默认 为 0
 * 接口地址 : /album/sublist
 * 调用例子 : /album/sublist ( 周杰伦 )
 */
export function getUserAlbumListAPI() {
  return request({
    url: "/album/sublist",
    params: {
      timestamp: new Date().getTime(),
    },
  });
}
/**
 * @description:
 * @return {*}
 * 收藏的歌手列表
 * 说明 : 调用此接口,可获取收藏的歌手列表
 * 接口地址 : /artist/sublist
 * 调用例子 : /artist/sublist
 */
export function getUserArtistListAPI() {
  return request({
    url: "/artist/sublist",
    params: {
      timestamp: new Date().getTime(),
    },
  });
}
/**
 * @description:
 * @return {*}
 * 听歌打卡
 * 说明 : 调用此接口 , 传入音乐 id, 来源 id，歌曲时间 time，更新听歌排行数据
 * 必选参数 : id: 歌曲 id, sourceid: 歌单或专辑 id
 * 可选参数 : time: 歌曲播放时间,单位为秒
 * 接口地址 : /scrobble
 * 调用例子 : /scrobble?id=518066366&sourceid=36780169&time=291
 */
export function getUserScrobbleListAPI(value: object) {
  return request({
    url: "/scrobble",
    params: {
      ...value,
      timestamp: new Date().getTime(),
    },
  });
}
/**
 * @description:
 * @return {*}
 * 最近播放-歌曲
 * 说明 : 调用此接口 , 可获得最近播放-歌曲
 * 可选参数 : limit : 返回数量 , 默认为 100
 * 接口地址 : /record/recent/song
 * 调用例子 : /record/recent/song?limit=1
 */
export function getUserRecordListAPI() {
  return request({
    url: "/record/recent/song",
    params: {
      limit: 20,
      timestamp: new Date().getTime(),
    },
  });
}
/**
 * @description:
 * @return {*}
 * 获取每日推荐歌曲
 * 说明 : 调用此接口 , 可获得每日推荐歌曲 ( 需要登录 )
 * 接口地址 : /recommend/songs
 * 调用例子 : /recommend/songs
 * 返回数据如下图 : 每日推荐歌曲
 */
export function getUserRecommendSongsListAPI() {
  return request({
    url: "/recommend/songs",
    params: {
      timestamp: new Date().getTime(),
    },
  });
}
/**
 * @description:
 * @return {*}
 * 私人 FM
 * 说明 : 私人 FM( 需要登录 )
 * 接口地址 : /personal_fm
 * 调用例子 : /personal_fm
 */
export function getPersonalFmAPI() {
  return request({
    method: "get",
    url: "/personal_fm",
    params: {
      timestamp: new Date().getTime(),
      real: "211.161.244.70",
    },
  });
}
