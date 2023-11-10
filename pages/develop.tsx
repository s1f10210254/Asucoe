import { ShowModel } from "@/component/Home/ShowModel/ShowModel";
import { Loading } from "@/component/Loading/Loading";
import { useEffect, useState } from "react";
import { createClient } from '@supabase/supabase-js'

export default function Develop(){
    const [isLoading, setIsLoading] = useState(true)
    useEffect(()=>{
        const timer = setTimeout(()=>{
            setIsLoading(false);
        }, 2000);

        return ()=>{
            clearTimeout(timer);
        }
    },[])

    const supabaseUrl = process.env.SUPABASEURL
    const supabaseAnonKey = process.env.SUPABASEANONKEY
    if(supabaseUrl === undefined) return;
    if(supabaseAnonKey === undefined) return;
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const handleLogin = async()=>{
        const {data, error} = await supabase.auth.signInWithOAuth({
            provider: 'github',
        })
        console.log("login")
    }

    const handleLogout=async()=>{
        const {error} = await supabase.auth.signOut()
        console.log("logout")
    }


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
            <div >
            <button onClick={handleLogin}>Ligin with GitHub</button>
            </div>
            <div>
            <button onClick={handleLogout}>Logout</button>

            </div>
        </div>
    )
}