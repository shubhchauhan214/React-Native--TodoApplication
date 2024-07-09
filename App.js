import { ScrollView, Text, View, Alert } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
/* import App.style.js file here */
import { s } from "./App.style";
/* import Header component  for header functioning*/
import { Header } from "./components/Header/Header";
/* import CardTodo component for body functioning*/
import { CardTodo } from "./components/CardTodo/CardTodo";
/* import TableBottomMenu component for footer functioning*/
import { TableBottomMenu } from "./components/TableBottomMenu/TableBottomMenu";
/* import buttonAdd component for addition of todo */
import { ButtonAdd } from "./components/ButtonAdd/ButtonAdd";
import { useEffect, useState, useRef } from "react";
/* import a dialog box in which we write a new todo*/
import Dialog from "react-native-dialog";
/* import for uuid*/
import uuid from "react-native-uuid";
/* import for async-storage*/
import AsyncStorage from "@react-native-async-storage/async-storage";


export default function App(){
  const [todoList, setTodoList] = useState([]);
  const [selectedTabName, setSelectedTabName] = useState("all");
  const [isAddDialogDisplayed, setIsAddDialogDisplayed] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const ScrollViewRef = useRef();

  useEffect(()=>{
    loadTodoList();
  },[]);


  useEffect(()=>{
    saveTodoList();
  },[todoList]);

  /* for async-storage we will add two functions first to load the data and second one is to store the data*/
  /* This is the link from where we can use async-storage https://docs.expo.dev/versions/latest/sdk/async-storage/ */
  /* This is the link from where we can learn how to use async storage.https://react-native-async-storage.github.io/async-storage/docs/usage/ */
  async function loadTodoList(){
    console.log("LOAD");
    try{
      const todoListString = await AsyncStorage.getItem("@todoList");
      const parsedTodoList = JSON.parse(todoListString);
      setTodoList(parsedTodoList || []);
    }catch(err) {
      alert(err);
    }
  }
  async function saveTodoList(){
    console.log("SAVE");
    try{
      await AsyncStorage.setItem("@todoList", JSON.stringify(todoList));

    }catch(err){
      alert(err);
    }
  }

  /* is function se hm all,inprogress or done vale coulmns me separately dekh skte h */
  function getFilteredList(){
    switch (selectedTabName){
      case "all":
        return todoList
      case "inProgress":
        return todoList.filter((todo) => todo.isCompleted===false) /*~return todoList.filter((todo) => !todo.isCompleted);*/
      case "done":
        return todoList.filter((todo) => todo.isCompleted===true) /*~return todoList.filter((todo) => todo.isCompleted);*/
    }
  }

  function deleteTodo(todoToDelete){
    Alert.alert("Delete todo", "Are you sure you want to delete this todo ?",
      [
        {text: "Delete", 
          style:"destructive", 
          onPress:() =>{
          setTodoList(todoList.filter(t => t.id !== todoToDelete.id));
        }},
        {text: "Cancel" ,style: "cancel"},
      ]);
  }

  function renderTodoList(){
    return getFilteredList().map((todo) =>(
      <View key={todo.id} style={s.cardItem}>
         <CardTodo onLongPress={deleteTodo} onPress={updateTodo} todo={todo}/>
      </View>
    ));
  }
  /* ye function todo k status ko update krne k liye likha gya h */
  function updateTodo(todo){
    const updatedTodo = {...todo, isCompleted: !todo.isCompleted};
    const updatedTodoList = [...todoList];
    const indexToUpdate = updatedTodoList.findIndex((t) => t.id === updatedTodo.id);
    updatedTodoList[indexToUpdate] = updatedTodo;
    setTodoList(updatedTodoList);
  }
/* create a function for new todo and use react native library for id*/
/*https://www.npmjs.com/package/react-native-uuid where we have to install library npm i react-native-uuid */
  function addTodo(){
    const newTodo = {
      id: uuid.v4(),
      title: inputValue,
      isCompleted: false,
    };
    setTodoList([...todoList, newTodo]);
    setIsAddDialogDisplayed(false);
    setInputValue("");
    setTimeout(() =>{
      ScrollViewRef.current.scrollToEnd();
    }, 300);

  }

  function renderAddDialog(){
    return(
      <Dialog.Container 
       visible={isAddDialogDisplayed} 
       onBackdropPress={() => setIsAddDialogDisplayed(false)}>
      <Dialog.Title>Add todo</Dialog.Title>
      <Dialog.Description>
        Choose a name for your todo
      </Dialog.Description>
      <Dialog.Input onChangeText={setInputValue} placeholder="Ex: Go to the dentist"/>
      <Dialog.Button label="Cancel" color="grey" onPress={() => setIsAddDialogDisplayed(false)}/>
      <Dialog.Button disabled={inputValue.length ===0} label="Save" onPress={addTodo} />
    </Dialog.Container>

    );
  }

  return(
    <>
      <SafeAreaProvider>
        <SafeAreaView style={s.app}>
          <View style={s.header}>
            <Header />
          </View>
          <View style={s.body}>
            <ScrollView ref={ScrollViewRef}>
            {renderTodoList()}
            </ScrollView>
          </View>
          <ButtonAdd onPress={() => setIsAddDialogDisplayed(true)} />
        </SafeAreaView>
      </SafeAreaProvider>
      <View style={s.footer}>
        <TableBottomMenu
           todoList = {todoList}
           onPress={setSelectedTabName} 
           selectedTabName={selectedTabName}
          />
      </View>
      {renderAddDialog()}
    </>
  );
}
