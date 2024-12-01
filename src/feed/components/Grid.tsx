import {View, StyleSheet, FlatList, Image, Text, Dimensions} from 'react-native';
import {COLORS, FONTFAMILY, FONTSIZE, SPACING} from '../theme/theme.ts';
import React, {useState} from 'react';

// interface GridProps {
//     children: React.ReactNode // 子组件
//     paddingHorizontal?: number // 子组件横向内边距
//     backGroundColor?: string // 背景颜色
// }

const { width } = Dimensions.get('window'); // 获取屏幕宽度
const itemsPerRow = 5; // 每行显示5个元素
const itemsPerColomn = 2; // 每列显示2个元素
const itemsPerPage = 10; // 每页显示10个元素

export interface GridProps {
    data: {
       id: string,
       image: string,
       name: string,
    }[]
}

export const Grid: React.FC<GridProps> = ({
    data,
}) => {
    const [currentPage, setCurrentPage] = useState(0); // 当前页面索引

    // 滚动事件处理
    const handleScroll = (event: any) => {
        const offsetX = event.nativeEvent.contentOffset.x;
        const pageIndex = Math.round(offsetX / width);
        console.log('pageIndex: ' + pageIndex);
        setCurrentPage(pageIndex);
    };

    // 处理分页数据
    const getPageData = (dataInput: any[]): any => {
        console.log('------- getPageData -------');
        console.log(dataInput);
        console.log('------- getPageData -------');

        const result = [];
        let temp: any[] = [];
        for (let i = 0; i < dataInput.length; i++) {
            if (temp.length < itemsPerPage) {
                temp.push(dataInput[i]);
            } else {
                result.push(temp);
                temp = [];
            }
        }
        // // 填充空的区域
        // for (let i = 0; i < itemsPerPage - temp.length; i++) {
        //     temp.push({});
        // }
        result.push(temp);
        console.log('------- result -------');
        for (let i = 0; i < result.length; i++) {
            console.log('index: ' + i + ', value: ' + result[i]);
        }
        console.log('------- result -------');
        return result;
    };

    // 单个网格渲染
    const renderSingleItem = ({item}: any) => {
        return <SingleGrid id={item.id} image={item.image} name={item.name} />;
    };

    // 一个分页渲染
    const renderSinglePage = ({item}: any) => {
        console.log(item);
        return (
            <FlatList
                data={item} // 数据列表
                renderItem={renderSingleItem} // 渲染单个元素
                keyExtractor={(tempData, _) => {return tempData.id;}} // 使用 id 作为 key
                numColumns={itemsPerRow} // 每行显示的元素个数
                showsHorizontalScrollIndicator={false} // 隐藏滚动条
                scrollEnabled={false} // 子页面禁止滚动
             />
        );
    };

    // 计算总页数
    const totalPages = Math.ceil(data.length / itemsPerPage);
    // 分页
    const pageDataList = getPageData(data);

    return (
        <View style={styles.container}>
            <FlatList
                data={pageDataList}
                renderItem={renderSinglePage}
                keyExtractor={(_, index) => {return index.toString();}} // 使用页索引作为 key
                horizontal={true} // 横向滚动
                showsHorizontalScrollIndicator={false} // 隐藏滚动条
                pagingEnabled={true} // 分页需要开启
                onScroll={handleScroll} // 滚动事件
            />
            {/** 分页提示器 **/}
            <View style={styles.indicatorContainer}>
                {Array.from({length: totalPages}).map((_, index) => {
                    return (
                        <View
                            key={index}
                            style={[
                                styles.indicator,
                                index === currentPage && styles.indicatorActive,
                            ]}
                         />
                    );
                })}
            </View>
        </View>

    );
};

interface SingleGridProps {
    id: string,
    image: string,
    name: string,
}

const SingleGrid: React.FC<SingleGridProps> = ({
    image, name,
}) => {
    return (
        <View style={styles.singleGrid}>
            <Image source={{uri: image}} style={styles.image} />
            <Text style={styles.name}>{name}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    singleGrid: {
        // flex: 1, 一定不能加，会有问题
        // 因为 padding 是属于容器的一部分，因此我们需要在换页的时候留出正常的空白区域
        // center 排列
        width: (width - SPACING.space_10 * 1) / itemsPerRow, // 计算每个元素的宽度
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: SPACING.space_10,
    },
    image: {
        width: SPACING.space_20,
        height: SPACING.space_20,
        borderRadius: SPACING.space_4,
        backgroundColor: COLORS.primaryWhiteHex,
    },
    name: {
        fontSize: FONTSIZE.size_8,
        color: COLORS.primaryBlackRGBA,
        fontFamily: FONTFAMILY.poppins_regular,
    },
    indicatorContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: SPACING.space_4,
    },
    indicator: {
        width: SPACING.space_4,
        height: SPACING.space_2,
        borderRadius: SPACING.space_2,
        backgroundColor: COLORS.primaryDarkGreyHex,
        marginHorizontal: SPACING.space_2,
    },
    indicatorActive: {
        backgroundColor: COLORS.primaryOrangeHex,
        width: SPACING.space_8,
    },
});
