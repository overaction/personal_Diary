import React, { useEffect, useRef, useState } from 'react'
import { useHistory } from 'react-router';
import { Button, Form, TextArea, Input } from 'semantic-ui-react';
const API = process.env.REACT_APP_API;

const Editing = ({diary,editing}) => {
    const history = useHistory();
    const {_id, images, text} = diary
    const fileRef = useRef()
    const [nowtext, setText] = useState()
    const [nowimages, setImages] = useState({
        files: []
    });
    const [clear, setClear] = useState(false);
    const onChangeText = (e) => {
        setText(e.target.value)
    }

    console.log(editing)
    const onChangeImage = (e) => {
        console.log(e.target.files.length)
        console.log(e.target.files[0])
        console.log(fileRef.current.value)
        setImages({});
        setImages({...nowimages, files: [...e.target.files]})
        setClear(false);
    }

    useEffect(() => {
        setText(text);
        console.log(images)
        setImages({files:[...images]});
        console.log(fileRef.current.value)
    },[images,text])

    console.log(nowimages.files);

    const onSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('clear',clear);
        formData.append('text',nowtext)
        let count = 1
        if(nowimages.files) {
            for(const k of nowimages.files) {
                console.log(k);
                formData.append(`image${count++}`,k);
            }
        }
        const res = await fetch(`${API}/${_id}`, {
            method:'PUT',
            headers: {
                //'Content-Type': 'multipart/form-data'
            },
            body: formData
        })
        const data = await res.json();
        console.log(data);
        editing = false
        history.go(0)
    }

    return (
        <Form onSubmit={onSubmit} noValidate>
            <Form.Input
                control={TextArea}
                name="text"
                label="Diary"
                placeholder="How's today?"
                value={nowtext}
                onChange={onChangeText}
                style={{ minHeight: 200, fontSize: 20 }}
            />
            <Button color="teal" as="label" htmlFor="file" type="button">
                Image
            </Button>
            <Button
                type="button"
                color="red"
                onClick={() => {
                    fileRef.current.value = "";
                    setImages({});
                    setClear(true);
                }}
            >
                image clear
            </Button>
            <input
                type="file"
                id="file"
                style={{ display: "none" }}
                multiple
                onChange={onChangeImage}
                ref={fileRef}
            />
            <Button type="submit" primary>
                Submit
            </Button>
            <Input style={{ fontSize: 20, marginLeft: 20, color: "teal" }}>
                {console.log(nowimages.files)}
                {nowimages.files && nowimages.files.length
                    ? `+${nowimages.files.length} images`
                    : "0 images"}
            </Input>
        </Form>
    );
}

export default Editing
