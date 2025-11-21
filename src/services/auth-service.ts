export interface User {
    id: string;
    name: string;
    email: string;
    companyName: string;
    role: 'admin' | 'user';
    avatarUrl?: string;
}

class AuthService {
    private currentUser: User | null = {
        id: 'user_123',
        name: 'Alex Morgan',
        email: 'alex@constructco.com',
        companyName: 'ConstructCo',
        role: 'admin',
        avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704d'
    };

    async login(email: string, password: string): Promise<User> {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Mock successful login
        this.currentUser = {
            id: 'user_123',
            name: 'Alex Morgan',
            email,
            companyName: 'ConstructCo',
            role: 'admin',
            avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704d'
        };

        return this.currentUser;
    }

    async signup(data: { name: string; email: string; companyName: string }): Promise<User> {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        this.currentUser = {
            id: `user_${Date.now()}`,
            name: data.name,
            email: data.email,
            companyName: data.companyName,
            role: 'admin'
        };

        return this.currentUser;
    }

    getCurrentUser(): User | null {
        return this.currentUser;
    }

    async logout(): Promise<void> {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        this.currentUser = null;
    }

    async updateProfile(data: Partial<User>): Promise<User> {
        await new Promise(resolve => setTimeout(resolve, 1000));
        if (this.currentUser) {
            this.currentUser = { ...this.currentUser, ...data };
            return this.currentUser;
        }
        throw new Error("No user logged in");
    }
}

export const authService = new AuthService();
