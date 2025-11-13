import { useGetMeRequest } from '../request'
import {CookieService} from "@shared/services/cookie/CookieService.ts";
import {ECookieKey} from "@shared/services/cookie/ECookieKey.ts";

const useGetMePresenter = () => {
    const cookieService = new CookieService();
    let accessToken: string | undefined;
    try {
        accessToken = cookieService.get(ECookieKey.ACCESS_TOKEN);
    } catch {
        accessToken = undefined;
    }


    const query = useGetMeRequest({
        enabled: !!accessToken,
    })

    const data = query.data ?? null

    return {
        ...query,
        data,
    }
}

export { useGetMePresenter }
