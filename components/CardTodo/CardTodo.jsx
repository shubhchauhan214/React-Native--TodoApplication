import { TouchableOpacity, Text, Image } from "react-native";
import checkImg from "../../assets/check.png";
import {s} from "./CardTodo.style";

export function CardTodo({todo, onPress}){
    return(
        <TouchableOpacity style={s.card} onPress={() => onPress(todo)}>
            {/* line through will be done thrugh text when iscompleted is true only*/}
            <Text style={[s.title, todo.isCompleted && {textDecorationLine: "line-through"},]}>{todo.title}</Text>
            {/*It tells that if work is true means if work is done.so check image appears or ye comment b curly bracket ki help se hoga*/}
            {todo.isCompleted && <Image style={s.img} source={checkImg}/>}
        </TouchableOpacity>
    );
}