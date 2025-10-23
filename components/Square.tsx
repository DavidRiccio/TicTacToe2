import { TouchableOpacity } from "react-native";
import { View } from "react-native-reanimated/lib/typescript/Animated";

export default function Square({val}:{val:string}) {
    const handleClick = ()=>{
        console.log(`${val}`);
        
        return ;
    }
  return <TouchableOpacity onPress={handleClick}></TouchableOpacity>;
}

export function Board(){
    return <View {...Array.from({length : 9}).map((_,index)=>{
        return <Square val={index.toString()}/>
    })}>
        <Board></Board>
  ;</View>
}