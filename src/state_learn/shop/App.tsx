import {Button, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import React, {useState, useEffect} from 'react';

export default function App() {
    return (
        <SafeAreaView style={{marginHorizontal: 30}}>
            <ProductTable />
        </SafeAreaView>
    );
}

interface ProductTableProps {
}

interface ProductRowProps {
    handleDecrement: (pd: Product) => void;
    product: Product;
    handleIncrement: (pd: Product) => void;
}

const ProductRow = ({ handleIncrement, handleDecrement, product }: ProductRowProps) => {
    return (
        <View
            style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 20,
                borderBottomWidth: StyleSheet.hairlineWidth,
            }}>
            <Text style={{flex: 1}}>{product.name}</Text>
            <Text style={{flex: 1}}>{product.price}</Text>
            <View
                style={{
                    alignSelf: 'flex-end',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                <Button
                    // hitSlop={10}
                    title="+"
                    onPress={() => handleIncrement(product)}
                />
                <Text>{product.count}</Text>
                <Button
                    // hitSlop={10}
                    title="-"
                    onPress={() => handleDecrement(product)}
                />
            </View>
        </View>
    );
}

const ProductTable= ({}: {}) => {
    const [products, setProducts] = useState<Products>([]);
    const [httpStatus, setHttpStatus] = useState(HttpRequestStatus.INIT);
    const [total, setTotal] = useState(0);

    // 数量-1
    const handleDecr = async (pd: Product) => {
        const count = pd.count - 1 >= 0 ? pd.count - 1 : 0;
        const newProduct: Product = {...pd, count};
        updateProducts(newProduct);
        await mockFetchUpdateProduct(newProduct);
    };

    // 数量+1
    const handleIncr = async (pd: Product) => {
        const count = pd.count + 1;
        const newProduct: Product = {...pd, count};
        updateProducts(newProduct);
        await mockFetchUpdateProduct(newProduct);
    };

    // 更新 products
    const updateProducts = (pd: Product) => {
        const newProducts = [...products];
        for (let index = 0; index < products.length; index++) {
            if (products[index].id === pd.id) {
                newProducts[index] = pd;
            }
        }
        setProducts(newProducts);
    }

    // 仅在组件装载时调用一次
    useEffect(() => {
        setHttpStatus(HttpRequestStatus.Pending);
        mockFetchGetProduct()
            .then((res) => {
                setProducts(res);
                let prices = 0;
                for (let i = 0; i < res.length; i++) {
                    prices = prices + res[i].price * res[i].count;
                }
                setTotal(prices);
                setHttpStatus(HttpRequestStatus.Success);
            })
            .catch((err) => {
                setHttpStatus(HttpRequestStatus.Error);
                console.log('error %s', err);
            })
    }, []);

    // useEffect(() => {
    //     setHttpStatus(HttpRequestStatus.INIT);
    //     fetch('http://127.0.0.1:4523/m1/5048863-4709824-default/products')
    //         .then((res) => {return res.json();})
    //         .then((pds: Products) => {
    //             setHttpStatus(HttpRequestStatus.Success);
    //             setProducts(pds);
    //         })
    //         .catch((error: TypeError) => {
    //             console.log('error %s', error);
    //         });
    // }, []);

    return (
        <View style={{marginTop: 10}}>
            <View style={{flexDirection: 'row'}}>
                <Text style={{flex: 1, fontWeight: 'bold'}}>名称</Text>
                <Text style={{flex: 1, fontWeight: 'bold'}}>价格</Text>
                <Text style={{alignSelf: 'flex-end', fontWeight: 'bold'}}>数量</Text>
            </View>
            {httpStatus === HttpRequestStatus.Pending && <Text>Loading...</Text>}
            {httpStatus === HttpRequestStatus.Error && <Text>Error</Text>}
            {httpStatus === HttpRequestStatus.Success &&
                <View>
                    {products.map(product => (
                        <ProductRow
                            handleIncrement={handleIncr}
                            handleDecrement={handleDecr}
                            product={product}
                            key={product.id}
                        />
                    ))}
                </View>
            }
            <Text style={{marginTop: 30, fontWeight: 'bold'}}>总价:{total}</Text>
        </View>
    );
}

enum HttpRequestStatus {
    INIT = 'INIT',
    Success = 'Success',
    Pending = 'Pending',
    Error = 'Error'
}

interface Product {
    name: string,
    price: number,
    id: string,
    count: number,
}

type Products = Product[];

// 模拟网络请求，读取 products
const mockFetchGetProduct = (): Promise<Products> => {
    const mockProduct = (): Product => {
        return {
            name: 'test product ' + Math.random().toString(16),
            price: Math.random() * 100,
            id: Math.random().toString(16),
            count: Math.floor(Math.random() * 100),
        }
    }
    const promise = new Promise<Products>((resolve, reject) => {
        setTimeout(() => {
            // const isOk = Math.random() > 0.1;
            if (true) {
                resolve([mockProduct(), mockProduct(), mockProduct(), mockProduct(), mockProduct()]);
            } else {
                reject(new Error('mock network error'));
            }
        }, 1000)
    })
    return promise;
}

// 模拟网络请求，更新 products
const mockFetchUpdateProduct = (product: Product): Promise<void> => {
    const promise = new Promise<void>((resolve, reject) => {
        setTimeout(() => {
            // const isOk = Math.random() > 0.1;
            if (true) {
                resolve();
            } else {
                reject(new Error('mock network error'));
            }
        }, 1000)
    })
    return promise;
}
