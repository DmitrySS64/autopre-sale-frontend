import { useGetMeRequest } from '../request'
import {CookieService} from "@shared/services/cookie/CookieService.ts";
import {ECookieKey} from "@shared/services/cookie/ECookieKey.ts";

const cookieService = new CookieService();

const useGetMePresenter = () => {
    let hasToken = false;
    try {
        cookieService.get(ECookieKey.ACCESS_TOKEN);
        hasToken = true;
    } catch {
        hasToken = false;
    }

    const query = useGetMeRequest({
        enabled: hasToken,
    })

    const data = query.data ?? null

    return {
        ...query,
        data,
    }
}

export { useGetMePresenter }
