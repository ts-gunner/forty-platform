import { getStorageSync,setStorageSync,removeStorageSync,clearStorageSync } from '@tarojs/taro';

const storage = {  
    getItem: async (key:string) => {  
      try {  
        return getStorageSync(key)
      } catch (e) {  
          console.error(e);
          return null
      }  
    },  
    setItem: async (key:string, value:string) => {  
      try {  
        setStorageSync(key, value);  
      } catch (e) {  
          console.error(e);  
          return null
      }  
    },  
    removeItem: async (key:string) => {  
      try {  
        removeStorageSync(key);  
      } catch (e) {  
          console.error(e);  
          return null
      }  
    }, 
    clearItem: async () => {
      try {
        clearStorageSync()
      }catch (e) {  
        console.error(e);  
        return null
    }  
    }
  };  

export default storage