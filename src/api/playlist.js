// 首先引入我们自定义的axios对象
import request from '@/utils/request'
// const BASE_URI = '/dev-api'
/**
 * 所有榜单
 * 说明 : 调用此接口,可获取所有榜单 接口地址 : /toplist
 * 调用例子 : /toplist
 */
export function getTopListAPI() {
    return request({
        methods: 'get',
        url: '/toplist',
        // params:{
        //     limit:10
        // }
    });
}
/**
 * 全部新碟
 * 说明 : 登录后调用此接口 ,可获取全部新碟
 * 可选参数 :
 * limit : 返回数量 , 默认为 30
 * offset : 偏移数量，用于分页 , 如 :( 页数 -1)*30, 其中 30 为 limit 的值 , 默认为 0
 * area : ALL:全部,ZH:华语,EA:欧美,KR:韩国,JP:日本
 * 接口地址 : /album/new
 * 调用例子 : /album/new?&limit=10
 */
export function getNewAlbumAPI(num) {
    return request({
        methods: 'get',
        url: '/album/new',
        params: {
            limit: num,
            realIP: '211.161.244.70'
        }
    });
}

/**
 * @description: 
 * @return {*}
 * 获取专辑列表
 * 说明 : 调用此接口 , 传入专辑 id, 可获得专辑内容
 * 必选参数 : id: 专辑 id
 * 接口地址 : /album
 * 调用例子 : /album?id=32311
 * 返回数据如下图 : 获取专辑内容
 */
export function getAlbumListAPI(id) {
    return request({
        methods: 'get',
        url: '/album',
        params: {
            id,
            limit: 100,
            realIP: '211.161.244.70'
        }
    });
}
/**
 * @description: 
 * @return {*}
 * 获取歌手专辑
 * 说明 : 调用此接口 , 传入歌手 id, 可获得歌手专辑内容
 * 必选参数 : id: 歌手 id
 * 可选参数 : limit: 取出数量 , 默认为 50
 * offset: 偏移数量 , 用于分页 , 如 :( 页数 -1)*50, 其中 50 为 limit 的值 , 默认 为 0
 * 接口地址 : /artist/album
 * 调用例子 : /artist/album?id=6452&limit=30 ( 周杰伦 )
 * 返回数据如下图 : 获取专辑内容
 */

export function getArtistAlbumAPI(id) {
    return request({
        methods: 'get',
        url: '/artist/album',
        params: {
            id,
            limit: 100,
            realIP: '211.161.244.70'
        }
    });
}

/** 
 * 说明 : 调用此接口 , 可获取推荐歌单
 * 可选参数 : limit: 取出数量 , 默认为 30 (不支持 offset)
 * 接口地址 : /personalized
 * 调用例子 : /personalized?limit=1 
 */
export function getRecommendPlaylistAPI(num) {
    return request({
        methods: 'get',
        url: '/personalized',
        params: {
            limit: num,
            realIP: '211.161.244.70'
        }
    });
}

/**
 * @description: 
 * @return {*}
 * 获取歌单详情
 * 说明 : 歌单能看到歌单名字, 但看不到具体歌单内容 , 调用此接口 , 传入歌单 id, 可 以获取对应歌单内的所有的音乐(未登录状态只能获取不完整的歌单,登录后是完整的)，但是返回的 trackIds 是完整的，tracks 则是不完整的，可拿全部 trackIds 请求一次 song/detail 接口获取所有歌曲的详情 (https://github.com/Binaryify/NeteaseCloudMusicApi/issues/452)
 * 必选参数 : id : 歌单 id
 * 可选参数 : s : 歌单最近的 s 个收藏者,默认为 8
 * 接口地址 : /playlist/detail
 * + detailId + '&timestamp=1648112779577&realIP=211.161.244.70',
 */
// export function getPlaylistDetailAPI(detailId) {
//     return request({
//         methods: 'get',
//         url: '/detail.json',
//     })
// }
export function getPlaylistDetailAPI(detailId) {
    return request({
        methods: 'get',
        url: '/playlist/detail',
        params: {
            id: detailId,
            timestamp: new Date().getTime(),
            realIP: '211.161.244.70'
        }
    })
}

/**
 * @description: 
 * @return {*}
 * 歌单 ( 网友精选碟 )
 * 说明 : 调用此接口 , 可获取网友精选碟歌单
 * 可选参数 : order: 可选值为 'new' 和 'hot', 分别对应最新和最热 , 默认为 'hot'
 * cat: tag, 比如 " 华语 "、" 古风 " 、" 欧美 "、" 流行 ", 默认为 "全部",可从歌单分类接口获取(/playlist/catlist)
 * limit: 取出歌单数量 , 默认为 50
 * offset: 偏移数量 , 用于分页 , 如 :( 评论页数 -1)*50, 其中 50 为 limit 的值\
 * 接口地址 : /top/playlist
 * 调用例子 : /top/playlist?limit=10&order=new
 */
export function getPlaylistCatAPI(catTag) {
    return request({
        method: 'get',
        url: '/top/playlist',
        params: {
            cat: catTag,
            offset: 0,
            realIP: '211.161.244.70'
        }
    })
}

/**
 * @description: 
 * @return {*}
 * 新歌速递
 * 说明 : 调用此接口 , 可获取新歌速递
 * 接口地址 : /top/song
 * 调用例子 : /top/song?type=96
 */
export function getNewSongAPI(num) {
    return request({
        method: 'get',
        url: '/top/song',
        params: {
            type: num,
            realIP: '211.161.244.70'
        }
    })
}

/**
 * 获取歌词
 * 说明 : 调用此接口 , 传入音乐 id 可获得对应音乐的歌词 ( 不需要登录 )
 * @param {number} id - 音乐 id
 */
export function getLyricAPI(id) {
    return request({
        url: '/lyric',
        method: 'get',
        params: {
            id,
        },
    })
};