import { useGetMeRequest } from '../request'

const useGetMePresenter = () => {
    const query = useGetMeRequest()
    const data = query.data ?? null

    return {
        ...query,
        data,
    }
}

export { useGetMePresenter }
