import {mockPost} from './api/homeAPI.ts';
import {SafeAreaView} from 'react-native';
import {WaterFall} from './components/WaterFall.tsx';

export const APPTest = () => {
    // const icons = mockIcon({pageSize: 19});
    // console.log(icons);
    // return (
    //     <SafeAreaView style={{flex: 1}}>
    //         <Grid data={icons}  />
    //     </SafeAreaView>
    // );

    const posts = mockPost({pageSize: 100});
    return (
        <SafeAreaView style={{flex: 1}}>
            <WaterFall/>
        </SafeAreaView>
    );
};
