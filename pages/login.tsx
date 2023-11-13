import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASEURL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASEANONKEY;
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

const Login = () => {
    const [user, setUser] = useState(null);
    const [isGuest, setIsGuest] = useState(false);

    const handleLoginWithGitHub = async () => {
        if (!supabase) return;
        await supabase.auth.signInWithOAuth({ provider: 'github' });
    };

    const handleLoginAsGuest = () => {
        setIsGuest(true);
    };

    // useEffect(() => {
    //     if (!supabase) return;

    //     // 現在のセッション情報を取得
    //     const currentSession = supabase.auth.session();
    //     setUser(currentSession?.user ?? null);
    //     setIsGuest(!currentSession);

    //     // 認証状態の変更をリッスン
    //     const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
    //         setUser(session?.user ?? null);
    //         setIsGuest(!session);
    //     });

    //     // コンポーネントのアンマウント時にリスナーを削除
    //     return () => {
    //         authListener?.unsubscribe();
    //     };
    // }, []);

    return (
        <div>
            <h1>ログイン</h1>
            <button onClick={handleLoginWithGitHub}>GitHubでログイン</button>
            <button onClick={handleLoginAsGuest}>ゲストとしてログイン</button>
        </div>
    );
};

export default Login;
