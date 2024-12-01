import React, {useEffect, useState} from 'react';
import {MasonryFlashList, MasonryListRenderItem} from '@shopify/flash-list';
import {WaterFallItem} from './WaterFallItem';
import {mockPost, PostModel} from '../api/homeAPI.ts';
import {RefreshControl} from 'react-native';

export interface WaterFallProps {
}

export const WaterFall: React.FC<WaterFallProps> = ({
}) => {
    const [posts, setPosts] = useState<PostModel[]>([]);
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const renderItemHandler: MasonryListRenderItem<PostModel> = ({item}) => {
        return <WaterFallItem data={item} />;
    };
    // 异步回调函数，组件不会等待异步函数回调完成，组件会直接渲染，所以需要保证异步回调结果能被组件正确重新渲染
    const onRefreshHandler = async () => {
        console.log('------------------------ refresh list begin');
        setRefreshing(true);
        const postListMocked = await mockPost({pageSize: 5});
        setPosts(postListMocked);
        setRefreshing(false);
        console.log('------------------------ refresh list end');
    };
    const itemKeyHandler = (item: PostModel, _: number): string => {
        return item.id;
    };
    // 回调函数可以是异步的
    const onEndReachedHandler = async (): Promise<void> => {
        console.log('---------- reach end of list');
        const postListMocked = await mockPost({pageSize: 5});
        setPosts((prePosts) => {return [...prePosts, ...postListMocked];});
        console.log('---------- reach end of list. posts length: ' + posts.length);
    };

    // 这里需要显示的调用异步函数
    // await 会阻塞后续的同步调用
    // then catch 不会阻塞后续的同步调用
    useEffect(() => {
        const doFetch = async (): Promise<void> => {
            try {
                await mockPost({pageSize: 5});
            } catch (error) {
                console.log(error);
            }
        };
        doFetch().then();
        // mockPost({pageSize: 5}).then((postList: PostModel[]) => {
        //     setPosts(postList);
        // }).catch((error) => {
        //     console.log(error);
        // });
    }, []); // 仅首次渲染执行


    return (
        <MasonryFlashList
            renderItem={renderItemHandler}
            data={posts}
            keyExtractor={itemKeyHandler}
            numColumns={2}
            estimatedItemSize={200}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefreshHandler}/>}
            onEndReached={onEndReachedHandler}
            onEndReachedThreshold={0.5} // 阈值，表示滚动到距离底部还有多少比例时触发
        />
    );
};
