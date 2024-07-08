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
import { useState } from "react";


export default function App(){
  const [todoList, setTodoList] = useState([
      { id: 1, title: "Walk the dog", isCompleted: true},
      { id: 2, title: "Go to the dentist", isCompleted: false},
      { id: 3, title: "Learn React native", isCompleted: false},
      { id: 4, title: "Walk the dog", isCompleted: true},
      { id: 5, title: "Go to the dentist", isCompleted: false},
      { id: 6, title: "Learn React native", isCompleted: false},
      { id: 7, title: "Walk the dog", isCompleted: true},
      { id: 8, title: "Go to the dentist", isCompleted: false},
      { id: 9, title: "Learn React native", isCompleted: false},
  ]);

  const [selectedTabName, setSelectedTabName] = useState("all");
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
    const updatedTodo = {...todo, isCompleted: !todo.isCompleted,};
    const updatedTodoList = [...todoList];
    const indexToUpdate = updatedTodoList.findIndex((t) => t.id === updatedTodo.id);
    updatedTodoList[indexToUpdate] = updatedTodo;
    setTodoList(updatedTodoList);
  }
  return(
    <>
      <SafeAreaProvider>
        <SafeAreaView style={s.app}>
          <View style={s.header}>
            <Header />
          </View>
          <View style={s.body}>
            <ScrollView>
            {renderTodoList()}
            </ScrollView>
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
      <View style={s.footer}>
        <TableBottomMenu
           todoList = {todoList}
           onPress={setSelectedTabName} 
           selectedTabName={selectedTabName}
          />
      </View>
    </>
  );
}
