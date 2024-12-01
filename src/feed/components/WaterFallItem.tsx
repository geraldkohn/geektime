import React, {useEffect, useRef, useState} from 'react';
import {Dimensions, Image, StyleSheet, Text, View} from 'react-native';
import {PostModel} from '../api/homeAPI.ts';
import {COLORS, FONTFAMILY, FONTSIZE, SPACING} from '../theme/theme.ts';

const {width: windowWidth} = Dimensions.get('window');
const containerWidth = windowWidth / 2; // 容器宽度为屏幕的一半
console.log('width: ' + containerWidth);

export interface WaterFallItemProps {
    data: PostModel
}

export const WaterFallItem: React.FC<WaterFallItemProps> = ({
    data,
}) => {
    const textRef = useRef(null); // 引用 Text 组件

    return (
        <View style={[styles.container, {width: containerWidth, height: data.imageHeight + 20 * 2 + 30}]}>
            <Image
                source={{uri: data.image}}
                style={[styles.image, {width: data.imageWidth, height: data.imageHeight}]}
                resizeMode="cover" // 图片裁剪填充
            />
            <View style={[styles.textContainer, {height: 20 * 2}]}>
                <Text
                    ref={textRef}
                    style={styles.text}
                    numberOfLines={2} // 限制最多显示两行
                    ellipsizeMode="tail" // 省略号模式
                >
                    {data.title}
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.primaryWhiteHex, // 加载前的占位背景
        borderRadius: SPACING.space_4, // 圆角
        overflow: 'hidden', // 隐藏超出部分，裁剪内容
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        // 测试
        borderColor: COLORS.primaryBlackRGBA, // 边框颜色
        borderWidth: 1,
    },
    image: {
        borderRadius: SPACING.space_4, // 圆角
    },
    textContainer: {
        width: containerWidth * 0.9,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        // 测试
        borderColor: COLORS.primaryOrangeHex, // 边框颜色
        borderWidth: 1,
    },
    text: {
        flex: 1,
        fontSize: FONTSIZE.size_14,
        fontFamily: FONTFAMILY.poppins_regular,
    },

});
