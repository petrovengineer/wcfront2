import React from 'react';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';

export default ({checkedEvent})=>{
    let {date, hour, minute, pics, videos} = checkedEvent;
    return (
    <>
        <Box width="100%">
        {
            pics.map((pic)=>(
                <Box width={320} display="inline-block" mx={0.5} key={pic}>
                    <Paper elevation={3}>
                        <img src={`http://smart-spb.ru/cw/showpicstatic?date=${date}&hour=${hour}&minute=${minute}&picture=${pic}`}/>
                    </Paper>
                </Box>
            ))
        }
            {/* <Box width="320px" height="240px" display="inline-block" mx={0.5}>
                <Paper elevation={3}>
                    <video src={`http://smart-spb.ru/cw/showvideostatic?date=${date}&hour=${hour}&video=${videos[0]}`} width="320px" height="240px"/>
                </Paper>
            </Box> */}
        </Box>
    </>
    )
}