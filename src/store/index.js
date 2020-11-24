import { createStore } from 'redux'
import Reactotron from '../config/ReactotronConfig'
import reducers from './ducks'

const store = createStore(reducers, Reactotron.createEnhancer())

export default store;
