import { FooterIcons } from "./footer-icons";
import { FooterLinks } from "./footer-links";
import {Instagram, ShoppingCart, Facebook, PhoneIcon, Mail} from "lucide-react";

import React from "react";
import { Fragment } from "react";
import {Input} from "@nextui-org/input";


export function Footer(){
    return (
        <footer className="bg-[#55585c] text-white h-1/6">
            <div className="container mx-auto flex flex-row justify-between items-center p-34">
                <div className="flex flex-row items-start max-w-1/3 justify-between space-x-4">
                    <a href="https://www.instagram.com/pro.sebe.store/" target="_blank">
                        <Instagram/>
                        pro.sebe.store
                    </a>
                    <a href="https://t.me/pro_sebe_store" target="_blank">
                        <Facebook/>
                        t.me/pro_sebe_store
                    </a>
                    <a href="+380667773028" target="_blank">
                        <PhoneIcon/>
                        +38066 777 3028
                    </a>
                    <a href="https://prosebestore@gmail.com" target="_blank">
                        <Mail/>
                        prosebestore@gmail.com
                    </a>
                </div>
                <div className="flex flex-row items-center mb-4">
                    <img src="/images/logo.png" alt="Logo" className="w-200 h-max min-w-unit-24"/>
                </div>
                <div className="flex flex-row justify-center align-middle m-0">
                    <Input
                        variant={"underlined"}
                        type={"email"}
                        label={"Електронна пошта"}
                    />
                    <Mail className="mt-6"/>
                </div>
                {/* <div className="flex flex-row justify-center mt-4">
                    <input type="email" placeholder="Your email" className="bg-white border rounded-md p-2"/>
                    <button className="bg-blue-500 text-white rounded-md px-4 py-2">Subscribe</button>
                </div>*/}
            </div>
        </footer>
    );
}

export default Footer;
