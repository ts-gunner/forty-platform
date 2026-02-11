import { LocaleLang } from "@/constants/enums";
import { Dispatch, RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
export const LangToggleButton: React.FC = () => {
  const dispatch = useDispatch<Dispatch>();
  const lang = useSelector((state: RootState) => state.globalModel.lang);
  const toggleLang = () => {
    dispatch.globalModel.setLang(lang === LocaleLang.ZH_CN ? LocaleLang.EN_US : LocaleLang.ZH_CN);
  };
  return (
    <button
      onClick={toggleLang}
      className="relative flex items-center justify-center text-gray-500 transition-colors bg-white border border-gray-200 rounded-full hover:text-dark-900 h-11 w-11 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
    >
      {lang === LocaleLang.ZH_CN && (
        <svg className="h-8 w-auto" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="9980" width="200" height="200">
          <path d="M524.8 550.4h83.2v83.2H524.8zM633.6 550.4h83.2v83.2H633.6z" fill="#6373f4" p-id="9981"></path>
          <path
            d="M832 326.4H467.2c-12.8 0-19.2 6.4-19.2 19.2 0 51.2-44.8 96-96 96-12.8 0-19.2 6.4-19.2 19.2V832c0 44.8 38.4 76.8 76.8 76.8H832c44.8 0 76.8-38.4 76.8-76.8V403.2c6.4-38.4-32-76.8-76.8-76.8z m-89.6 345.6h-19.2v-19.2H633.6v102.4h-19.2v-102.4H524.8v19.2h-19.2V531.2h108.8v-57.6h19.2v51.2h108.8v147.2z"
            fill="#6373f4"
            p-id="9982"
          ></path>
          <path
            d="M108.8 377.6V166.4h128V192H134.4v64h96v25.6H134.4v70.4h108.8v25.6H108.8zM268.8 377.6V224h19.2v19.2l19.2-19.2h25.6c6.4 0 12.8 0 19.2 6.4 6.4 0 12.8 6.4 12.8 12.8 6.4 6.4 6.4 12.8 6.4 19.2v128h-19.2V288v-25.6c0-6.4-6.4-6.4-6.4-12.8s-12.8-6.4-19.2-6.4c-12.8 0-19.2 6.4-25.6 12.8-6.4 6.4-6.4 19.2-6.4 38.4v83.2h-25.6z"
            fill="#6373f4"
            p-id="9983"
          ></path>
        </svg>
      )}
      {lang === LocaleLang.EN_US && (
        <svg className="h-8 w-auto" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5135" width="200" height="200">
          <path
            d="M879.104 696.832V629.76h-27.648v67.584h-134.144v176.128h27.136V849.92h107.008v128h27.648v-128h107.52v23.552h27.136v-176.128h-134.656z m-27.648 126.464h-107.008v-100.352h107.008v100.352z m135.168 0h-107.52v-100.352h107.52v100.352zM739.84 605.184V146.432c0-55.296-44.544-99.84-99.84-99.84H110.08C54.784 46.592 10.24 91.136 10.24 146.432v529.92c0 55.296 44.544 99.84 99.84 99.84h458.752c13.824 0 25.088-11.264 25.088-25.088 0-66.56 54.272-120.832 120.832-120.832 13.824 0 25.088-11.264 25.088-25.088z m-365.568-59.392H209.92V276.992h159.232v31.744H239.104v81.92h121.856v31.744H239.104v91.136h135.168v32.256z m165.888 0h-26.624V427.52c0-14.336-1.024-24.576-3.584-31.232-2.048-6.144-6.144-11.264-11.264-15.36-5.12-3.584-11.776-5.632-17.92-5.632-12.288-0.512-23.552 5.12-30.72 14.336-7.68 9.728-11.776 26.112-11.776 49.664v106.496h-27.136v-194.56H435.2V378.88c5.12-9.728 12.288-17.92 21.504-24.064 8.704-5.632 18.944-8.192 29.184-7.68 8.704 0 16.384 1.536 23.552 5.12 7.168 3.584 12.8 7.68 17.408 13.312 4.608 6.144 8.192 13.312 9.728 20.992 2.048 8.704 3.072 22.016 3.072 39.936v119.296z"
            p-id="5136"
            fill="#6373f4"
          ></path>
        </svg>
      )}
    </button>
  );
};
