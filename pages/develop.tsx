import { ShowModel } from "@/component/Home/ShowModel/ShowModel";
import { Loading } from "@/component/Loading/Loading";
import { useEffect, useState } from "react";
import { createClient } from '@supabase/supabase-js'

export default function Develop(){
    const [isLoading, setIsLoading] = useState(true)
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    useEffect(()=>{
        const timer = setTimeout(()=>{
            setIsLoading(false);
        }, 2000);

        return ()=>{
            clearTimeout(timer);
        }
    },[])

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASEURL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASEANONKEY
    
    if(supabaseUrl === undefined) return;
    if(supabaseAnonKey === undefined) return;
    
    

    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    // const handleLogin = async()=>{
    //     const {data, error} = await supabase.auth.signInWithOAuth({
    //         provider: 'github',
    //     })
    //     if(error){
    //         console.error('ログインエラー', error);
    //         alert(`ログインに失敗しました: ${error.message}`);
    //     }else if(data){
    //         console.log('ログイン成功', data);
    //         alert('ログインに成功しました');
    //     }
    // }

    // const handleLogout=async()=>{
    //     const {error} = await supabase.auth.signOut()
    //     if (error) {
    //         console.error('ログアウトエラー', error);
    //         alert(`ログアウトに失敗しました: ${error.message}`);
    //     } else {
    //         console.log('ログアウト成功');
    //         alert('ログアウトに成功しました');
    //     }
    // }

    

    const handleSignUp = async () => {
        const response = await supabase.auth.signUp({
            email,
            password
        });
    
        if (response.error) {
            console.error('サインアップエラー', response.error);
        } else {
            console.log('サインアップ成功', response.data.user, response.data.session);
        }
      };

    return (
        <div style={{display: "flex"}}>
            {/* {isLoading ? (
                <div>
                    <Loading/>
                </div>
            ) : (
                <div>
                    <ShowModel/>
                </div>
            )} */}
            {/* サインアップフォーム */}
            <form onSubmit={(e) => {
                e.preventDefault();
                handleSignUp();
            }}>
                <div>
                    <label htmlFor="email">メールアドレス:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="password">パスワード:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button type="submit">サインアップ</button>
            </form>
        </div>
    )
}