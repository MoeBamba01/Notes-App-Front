import React from 'react'
import { useState } from 'react'
import TagInput from '../../components/input/TagInput'
import { MdClose } from 'react-icons/md';
import axiosInstance from '../../utils/axiosInstance';

const AddEditNotes = ({ noteData, type, getAllNotes, onClose, showToastMessage}) => {

    const [title, SetTitle] = useState(noteData?.title || '');
    const [content, SetContent] = useState(noteData?.content || '');
    const [tags, SetTags] = useState(noteData?.tags || []);
    const [error, setError] = useState (null);

    // Add NoteLogic

    const addNewNote = async () => {

        try{
            const response = await axiosInstance.post("/add-note", {
                title,
                content, 
                tags, });

                if (response.data && response.data.note) {
                    showToastMessage("Note Added Successfully");
                    getAllNotes();
                    onClose();
                }
            
        } catch(error) {
            if (
                error.response &&
                error.response.data &&
                error.response.data.message
            ) {
                setError(error.response.data.message);
            }
        }
    }

    // Edit Note Logic

    const editNote = async () => {
        const noteId = noteData._id

        try{
            const response = await axiosInstance.put("/edit-note/" + noteId, {
                title,
                content, 
                tags, });

                if (response.data && response.data.note) {
                    showToastMessage("Note Updated Successfully");
                    getAllNotes();
                    onClose();
                }
            
        } catch(error) {
            if (
                error.response &&
                error.response.data &&
                error.response.data.message
            ) {
                setError(error.response.data.message);
            }
    }
}



    const handleAddNote = () => {
        if (!title) {
            setError("Please enter title")
            return;
        }
        if (!content) {
            setError("Please enter content")

            return;
        }
        setError("");

        if (type === 'edit'){
            editNote()
        } else {
            addNewNote() 
        }
        onClose();
    };


    return (


    <div className='relative'>

        <button
        className='w-10 h-10 rounded-full flex items-center justify-center absolute -top-3 -right-3 hover:bg-slate-100'
        onClick={onClose}
        
        >
            <MdClose className='text-xl text-slate-400'/>

        </button>

        <div className="flex flex-col gap-2">
            <label className='input-label'>Title</label>
            <input 
            type="text"
            className='text-2xl text-slate-950 outline-none'
            placeholder='Mets le Titre ici...'
            value={title}
            onChange={({target}) => SetTitle (target.value)}
            />
        </div>
        <div className='flex flex-col gap-2 mt-4'>
            <label className='input-label'>Content</label>
            <textarea 
            type="text" 
            className="text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded" 
            placeholder='La tu place ton contenu...'
            rows={10}
            value={content}
            onChange={({target}) => SetContent (target.value)}
            />

        </div>

        {error && <p className='text-red-500 text-xs pt-4 ' >{error} </p>}

        <div className="mt-3">
            <label className='input-label'>Tags</label>
            <TagInput tags={tags} setTags={SetTags} />
            <button className='btn-primary font-medium mt-5 p-3 ' onClick={handleAddNote}>
                {type === "edit" ? "UPDATE" : "ADD"}
            </button>
        </div>
    </div>
  )
}

export default AddEditNotes