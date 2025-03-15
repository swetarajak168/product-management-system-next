export interface AuthProviderType {
    login: (email: string, password: string) => Promise<void>,
    register: (name: string, email: string, password: string, password_confirmation: string) => Promise<void>,
    isLoading: boolean,
    authToken: string | null,
    logout: () => void,
    loginErrors: {
        email?: string,
        password?: string
    },
    registerErrors: {
        name?: string,
        email?: string,
        password?: string,
        password_confirmation?: string
    },
    fetchUserData:(email: string, password: string) => Promise<void>,
}
