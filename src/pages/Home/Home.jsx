import React, { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar/Navbar'
import NoteCard from '../../components/Cards/NoteCard'
import { MdAdd } from 'react-icons/md'
import AddEditNotes from './AddEditNotes'
import Modal from "react-modal"
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../../utils/axiosInstance'
import Toast from '../../components/ToastMessage/Toast'
import EmptyCard from '../../components/EmptyCard/EmptyCard'
import AddNotesImg from "../../assets/images/add-note.svg"
import NoDataImg from "../../assets/images/no-data.svg"

Modal.setAppElement("#root");

const Home = () => {

  const [openAddEditModal, setOpenAddEditModal] = useState ({
    isShown: false,
    type: "add",
    data: null,
  });

  const [showToastMsg, setShowToastMsg] = useState ({
    isShown: false,
    message: "",
    type: "add"
  });

  const [allNotes, setAllNotes] = useState ([]);
  const [userInfo, setUserInfo] = useState(null);

  const [isSearch, setIsSearch] = useState(false);

  const navigate = useNavigate();

  const handleEdit = (noteDetails) => {
    setOpenAddEditModal ({isShown: true, data: noteDetails, type:"edit"});
  };

  const showToastMessage = (message, type) => {
    setShowToastMsg({
      isShown: true,
      message,
      type,
      
    });
  };


  const handleCloseToast = () => {
    setShowToastMsg({
      isShown: false,
      message: "",
    
    });
  };


  const getUserInfo = async () => {
    try{
      const response = await axiosInstance.get("/get-user");
      if (response.data && response.data.user){
        setUserInfo(response.data.user);
      }
    } catch (error){
      if (error.response.status === 401){
        localStorage.clear()
        navigate("/login");
      }
      }
    };
    // Get NOtes APi
    const getAllNotes = async () => {
      try {
        const response = await axiosInstance.get("/get-all-notes");

        if (response.data && response.data.notes){
          setAllNotes(response.data.notes);
        }
      } catch (error){
        console.log("An Unexpected Error Occured Please Try AGain");
      }
    };



    const deleteNote = async (data) => {
      const noteId = data._id

      try{
          const response = await axiosInstance.delete("/delete-note/" + noteId);

              if (response.data && !response.data.error) {
                  showToastMessage("Note Deleted Successfully", 'delete');
                  getAllNotes();
                  
              }
          
      } catch(error) {
          if (
              error.response &&
              error.response.data &&
              error.response.data.message
          ) {
            console.log("An Unexpected Error Occured Please Try AGain");
          }
  }
}



const onSearchNote = async (query) => {
  try {
    const response = await axiosInstance.get("/search-notes", {
      params: { query },
    });
    if (response.data && response.data.notes) {
      setIsSearch(true);
      setAllNotes(response.data.notes);
    } else {
      setIsSearch(false); // Reset isSearch if no notes are found
    }
  } catch (error) {
    console.log(error);
  }
};

const updateIsPinned = async (noteData) => {
  const noteId = noteData._id;
  console.log("Note ID:", noteId);

  try {
    const response = await axiosInstance.put(`/update-note-pinned/${noteId}`, {
      isPinned: !noteData.isPinned // Corrected field access
      
    });

    if (response.data && response.data.note) {
      showToastMessage("Note Updated Successfully");
      getAllNotes();
    }
  } catch (error) {
    console.log(error);
  }
};


const handleClearSearch = () => {
  setIsSearch(false);
  getAllNotes();
};


    useEffect(() => {
      getAllNotes();
      getUserInfo();
      return () => {};
    } , []);


  return (
    <>
    <Navbar userInfo={userInfo}
     onSearchNote={onSearchNote}
     handleClearSearch= {handleClearSearch}
    
     />
    <div className="container mx-auto ">
{    allNotes.length > 0 ?  <div className='grid grid-cols-3 gap-4 mt-8'>
      {allNotes.map((item, index) => (
    <NoteCard 
      key={item._id}
      title={item.title} 
      date={item.createdOn}
      content={item.content}
      tags={item.tags}
      isPinned={item.isPinned}
      onEdit={() => handleEdit (item)}
      onDelete={() => deleteNote(item)}
      onPinNote={() => updateIsPinned(item)}
      className="mx-auto max-w-md"
    />
  ))}

      </div> : <EmptyCard  
      imgSrc={ isSearch ? NoDataImg : AddNotesImg} 
      message={isSearch ? `Oops No notes matching your search Found ` :`Start creating your first Note Click the "Add" button to start writing your thoughts, reminders, ideas but write something normal i tell you`} /> }
    </div>

    <button className='w-16 h-16 flex items-center justify-center rounded-2xl bg-primary hover:bg-blue-600 absolute right-10 bottom-10'
        onClick={() => {
          setOpenAddEditModal({isShown: true, type: "add", data: null});
        }}>
      <MdAdd className='text-[32px] text-white'/>
    </button>

    <Modal 
  isOpen={openAddEditModal.isShown}
  onRequestClose={() => {
    setOpenAddEditModal({ isShown: false, type: "add", data: null });
  }}
  style={{
    overlay: {
      backgroundColor: "rgba(0,0,0,0.2)",
    },
    content: {
      width: "40%",
      maxHeight: "75vh",
      backgroundColor: "white",
      borderRadius: "4px",
      margin: "auto",
      marginTop: "5rem",
      padding: "1rem",
      overflow: "auto",
    },
  }}
>
  <AddEditNotes
      type={openAddEditModal.type}
      noteData={openAddEditModal.data}
      onClose={() => {
      setOpenAddEditModal({ isShown: false, type: "add", data: null });
      
    }}
    getAllNotes={getAllNotes}
    showToastMessage={showToastMessage}
  />
</Modal>

<Toast
  isShown={showToastMsg.isShown}
  message={showToastMsg.message}
  type= {showToastMsg.type}
  onClose={handleCloseToast}
  />

    </>
  )
}

export default Home