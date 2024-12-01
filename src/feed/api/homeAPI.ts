import { faker } from '@faker-js/faker';
import {Dimensions, Image} from 'react-native';
const {width: windowWidth} = Dimensions.get('window');
const imageWidth = windowWidth * 0.98 / 2; // 容器宽度为屏幕的一半
console.log('width: ' + imageWidth);

// 定义容器宽高比的阈值
const MIN_ASPECT_RATIO = 3 / 4; // 最小宽高比
const MAX_ASPECT_RATIO = 16 / 9; // 最大宽高比

export interface PostModel {
    id: string;
    title: string;
    content: string;
    image: string;
    imageWidth: number;
    imageHeight: number;
    author: string;
    like: number;
}

export interface IconModel {
    id: string;
    image: string;
    imageWidth?: string;
    imageHeight?: string;
    name: string;
}

// async 本身已经封装了 Promise
export async function mockPost({pageSize}: {pageSize: number}): Promise<PostModel[]> {
    const posts: PostModel[] = [];
    for (let i = 0; i < pageSize; i++) {
        let tempPost: PostModel = {
            id: faker.string.uuid(),
            title: faker.lorem.sentence(),
            content: faker.lorem.sentence(),
            image: faker.image.url(),
            author: faker.person.fullName(),
            like: faker.number.int(),
            imageWidth: 0,
            imageHeight: 0,
        };
        // 异步函数，需要使用state来更新状态！！！
        const {width, height} = await Image.getSize(tempPost.image);
        // console.log('image size outer: ' + width + 'x' + height);
        let ratio = width / height; // 计算图片的宽高比
        // 限制宽高比在阈值内
        if (ratio < MIN_ASPECT_RATIO) {ratio = MIN_ASPECT_RATIO;}
        if (ratio > MAX_ASPECT_RATIO) {ratio = MAX_ASPECT_RATIO;}
        tempPost.imageWidth = imageWidth;
        tempPost.imageHeight = imageWidth / ratio;
        posts.push(tempPost);
    }
    return posts;
}

export function mockIcon({pageSize}: {pageSize: number}): IconModel[] {
    const icons: IconModel[] = [];
    for (let i = 0; i < pageSize; i++) {
        const icon: IconModel = {
            id: faker.string.uuid(),
            image: faker.image.url(),
            name: 'asdfasldkjflaskjflaskfjalk',
        };
        icons.push(icon);
    }
    return icons;
}

export function queryPosts(): Promise<PostModel[]> {
    return new Promise<PostModel[]>((resolve, reject) => {
        setTimeout(() => {
            const pageSize = 20;
            if (Math.random() > 0.01) {
                resolve(mockPost({pageSize}));
            } else {
                reject(new Error('network error'));
            }
        });
    });
}

export function queryIcons(): Promise<IconModel[]> {
    return new Promise<IconModel[]>((resolve, reject) => {
        setTimeout(() => {
            const pageSize = 10;
            if (Math.random() > 0.01) {
                resolve(mockIcon({pageSize}));
            } else {
                reject(new Error('network error'));
            }
        });
    });
}
