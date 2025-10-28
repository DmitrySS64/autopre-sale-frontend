const ROOT_AUTH = "auth:"
enum EQueryKeys {
    GET_ME = `${ROOT_AUTH}get-me`,
}

enum EMutationKeys {
    REGISTER = `${ROOT_AUTH}register`,
    SIGN_IN = `${ROOT_AUTH}sign-in`,
    SIGN_OUT = `${ROOT_AUTH}sign-out`,
    REFRESH_TOKEN = `${ROOT_AUTH}refresh-token`,
}

enum EAuthAPI {
    ROOT = "/auth/",
    GET_ME = `${ROOT}get_user`,
    REGISTER = `${ROOT}register`,
    SIGN_IN = `${ROOT}sign-in`,
    SIGN_OUT = `${ROOT}sign-out`,
    REFRESH_TOKEN = `${ROOT}refresh-token`,
}

export { EQueryKeys, EMutationKeys, EAuthAPI };