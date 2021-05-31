import React, { useContext, useRef, useState } from 'react'
import { useHistory } from 'react-router';
import { Button, Form, Input, TextArea } from 'semantic-ui-react'
import { AuthContext } from '../context/auth';
const API = process.env.REACT_APP_API;

const CreatePost = () => {
    const fileRef = useRef()
    const history = useHistory();
    const context = useContext(AuthContext);
    const [text, setText] = useState('')
    const [images, setImages] = useState({
        files: []
    });
    const onChangeText = (e) => {
        setText(e.target.value)
    }

    const onChangeImage = (e) => {
        console.log(e.target.files.length)
        console.log(e.target.files[0])
        setImages({});
        setImages({...images, files: [...e.target.files]})
    }

    const onSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('username',context.user)
        formData.append('text',text)
        let count = 1
        if(images.files) {
            for(const k of images.files) {
                console.log(k)
                formData.append(`image${count++}`,k);
            }
        }
        await fetch(`${API}/createpost`, {
            method:'POST',
            headers: {
                //'Content-Type': 'multipart/form-data'
            },
            body: formData
        })
        history.push('/')
    }
    return (
        <Form onSubmit={onSubmit} noValidate>
            <Form.Input
                control={TextArea}
                name="text"
                placeholder="How's today?"
                value={text}
                onChange={onChangeText}
                style={{minHeight: 200, fontSize:20}}
            />
            <Button color="teal" as="label" htmlFor="file" type="button">
                Image
            </Button>
            <Button type="button" color="red" onClick={() => {
                fileRef.current.value = ""
                setImages({});
            }}>
                image clear
            </Button>
            <input type="file" id="file" style={{display: "none"}} multiple onChange={onChangeImage} ref={fileRef}/>
            <Button type="submit" primary>
                Submit
            </Button>
            <Input style={{fontSize: 20, marginLeft:20, color:"teal"}}>
                {images.files && images.files.length ? `+${images.files.length} images` : '0 images'}
            </Input>
        </Form>
    );
}

export default CreatePost
