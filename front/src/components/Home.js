import React, { useContext, useEffect, useState } from 'react'
import { Button, Header, Icon, Image, Segment, Popup } from 'semantic-ui-react';
import moment from 'moment'
import Editing from '../utils/Editing';
import { AuthContext } from '../context/auth';
const API = process.env.REACT_APP_API;

const Home = () => {
    const context = useContext(AuthContext);
    const [editing, setEditing] = useState(false)
    const [currentDiary, setCurrentDiary] = useState()
    const [diaries, setDiaries] = useState([])
    const fetchDiaries = async () => {
        const res = await fetch(`${API}/kmc04`, {
            method:'GET',
            headers: {
                //'Content-Type': 'multipart/form-data'
            },
        })
        const data = await res.json();
        console.log(data);
        setDiaries(data);
    }
    
    async function deleteDiary(postId) {
        const res = await fetch(`${API}/${postId}`, {
            method:'DELETE',
        })
        const data = await res.json();
        console.log(data);
        fetchDiaries();
    }
    
    useEffect(() => {
        fetchDiaries()
    },[])

    const openEditor = (diary) => {
        setCurrentDiary(diary);
        console.log(diary)
        setEditing(true);
    }

    return (
        <div>
            {context.user ? (
                editing ? (
                    <Editing diary={currentDiary} editing={editing}/>
                ) : (
                    diaries.map((item) => (
                        <Segment style={{ margin: 0, paddingLeft: 20 }}>
                            <Header
                                as="h3"
                                style={{
                                    margin: 0,
                                    padding: 10,
                                    display: "flex",
                                    justifyContent: "space-between",
                                }}
                            >
                                <div>
                                    <Icon disabled name="time" />
                                    {moment(item.date).fromNow(true)} ago
                                </div>
                                <Button.Group>
                                    <Button positive onClick={() => openEditor(item)}>Edit</Button>
                                    <Button.Or />
                                    <Button
                                        negative
                                        onClick={() => deleteDiary(item._id)}
                                    >
                                        Delete
                                    </Button>
                                </Button.Group>
                            </Header>
                            <h1>
                                <Icon
                                    disabled
                                    name="address book outline"
                                    style={{ marginLeft: 9 }}
                                />
                                {item.text}
                            </h1>
                            {item.images.length ? (
                                <Image.Group size="medium">
                                    {item.images.map((image) => (
                                        <Image src={image} />
                                    ))}
                                </Image.Group>
                            ) : (
                                ""
                            )}
                        </Segment>
                    ))
                )
            ) : (
                <div style={{textAlign:'center'}}>
                    <h1 style={{marginBottom: 100}}>Personal Diary Service</h1>
                    <h2>How to use?</h2>
                    <div>
                        <div>
                            <Popup 
                                trigger={<Button circular color='facebook' icon='question' size="huge"/>}
                                content='1. Register'
                                hideOnScroll
                            />
                            <Popup 
                                trigger={<Button circular color='facebook' icon='question' size="huge"/>}
                                content='2. Login'
                                hideOnScroll
                            />
                            <Popup 
                                trigger={<Button circular color='facebook' icon='question' size="huge"/>}
                                content='3. Create and see your diaries'
                                hideOnScroll
                            />
                        </div>
                        <a href="http://naver.com"><Button style={{marginTop: 10}} circular color='github' icon='github' size="big"/></a>
                    </div>
                </div>
            )
        }
        </div>
    );
}

export default Home
