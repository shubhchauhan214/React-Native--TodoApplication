import { TouchableOpacity, Text } from "react-native";
import {s} from "./ButtonAdd.style";


export function ButtonAdd({onPress}){
    return <TouchableOpacity onPress={onPress} style={s.btn}>
        <Text style={s.txt}> + New todo</Text>
    </TouchableOpacity>;
}