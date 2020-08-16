// 引入创建仓库的api createstore
import { createStore,applyMiddleware } from 'redux'
// 引入reducer
import numReducer from './reducer/numReducer'

import reduxThunk from 'redux-thunk'
// 导出仓库
export default createStore(numReducer,applyMiddleware(reduxThunk))