'use client'

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/utils/CN";

interface ModalProps{
    title?:string;
    description?:string;
    isOpen:boolean;
    onClose: ()=>void;
    children?:React.ReactNode;
    classname?:string;
    hideHeader?:boolean
};

export const Modal : React.FC<ModalProps> = ({
    title,
    description,
    isOpen,
    onClose,
    children,
    classname,
    hideHeader=false
})=>{
    const onChange = (open:boolean)=>{
        if(!open){
            onClose();
        }
    }

    return(
        <Dialog open={isOpen} onOpenChange={onChange}>
            <DialogContent className={cn("min-w-fit",classname)}>
                {!hideHeader && <DialogHeader>
                    <DialogTitle className="text-3xl">{title}</DialogTitle>
                    <DialogDescription>
                        {description}
                    </DialogDescription>
                </DialogHeader>}
                <div>
                    {children}
                </div>
            </DialogContent>
        </Dialog>
    )
}