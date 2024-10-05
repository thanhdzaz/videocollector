import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { firestore, storage } from "../firebase";
import { Flex, Button, Input } from 'antd';

export const Upload = () => {
    const [fileUpload, setFile] = useState<any>(null);
    const [name, setName] = useState('');
    const navigate = useNavigate();

    function handleUpload() {
        const type = fileUpload.type.includes('image') ? 'photos' : 'videos';
        debugger
        storage.upload(`${type}/${new Date().getTime()}-${fileUpload.name}`, fileUpload).then((fileSrc) => {
            firestore.add('data', { name, src: fileSrc, type, createdDate: new Date().getTime() }).then(({ id }) => {
                navigate(`/view/${id}`);
            })
        })
    }

    return (
        <Flex
            flex={'1'}
            justify={'center'}
            style={{
                padding: 10
            }}
            vertical
            gap={10}
        >

            <Input type="text" placeholder="Tên File" value={name} onChange={({ target: { value } }) => { setName(value) }} />
            <Input type="file" accept="video/*,image/*" onChange={({ target: { files: [file] } }: any) => {
                setFile(file);
                if (name === '') {
                    setName(file.name)
                }
                if (file.type.includes('image')) {
                    const url = URL.createObjectURL(file);
                    document.querySelectorAll('#preview').forEach((elm: any) => {
                        elm.src = url;
                    })
                }
            }} />
            <Button disabled={name === '' || !fileUpload} onClick={handleUpload}>Tải lên</Button>
            <img src="" alt="" id='preview' />
        </Flex>
    )
}