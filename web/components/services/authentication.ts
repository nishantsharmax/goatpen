import { useMutation } from "@tanstack/react-query";
import api from "../utils/axiosInstace";
import crypto from 'crypto';

export const useSignin = (router: any, toast: any) => {
    return useMutation({
        mutationFn: async (data: any)=>{
            const hashedInputPassword = crypto.createHash('sha256').update(data.password || '').digest('hex');
            const payload = {
              'username': data.username || '',
              'password': hashedInputPassword
            }
            const response=await api.post('/public/login', payload);
            return response.data;
        },
        onSuccess: (res) => {
            toast({
              variant: "success",
              title: "Logged In Successfully!",
              description: "User Logged In Successfully!",
            })
            window.location.href="/";
          },
          onError: (err: any) => {
            console.log("useSignin err=", err);
            toast({
              variant: "destructive",
              title: `${err?.response.data.error || err?.response.data.message || "Something went wrong!"}`,
              description: "User Logged In Failed!",
            })
          },
    })
}

export const useSignOut = (router: any, toast: any) => {
  return useMutation({
      mutationFn: async ()=>{
          const payload = {
            'origin': window.location.origin
          }
          const response=await api.post('/public/logout', payload);
          return response.data;
      },
      onSuccess: (res) => {
          router.push("/login");
          toast({
            variant: "success",
            title: "Logged Out Successfully!",
            description: "User Logged Out Successfully!",
          })
        },
        onError: (err: any) => {
          console.log("useSignOut err=", err);
          toast({
            variant: "destructive",
            title: `${err?.response.data.error || err?.response.data.message || "Something went wrong!"}`,
            description: "User Logged Out Failed!",
          })
        },
  })
}
