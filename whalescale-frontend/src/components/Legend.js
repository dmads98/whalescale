import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const PaddedCell = withStyles((theme) => ({
    root: {
        padding: '12px'
    },
}))(TableCell);


export default function Legend() {

  return (
    <TableContainer component={Paper} style={{margin: '10px auto', minWidth: '300px', border: "1px solid #eaeaea", borderRadius: '25px'}}>
      <Table size="small" aria-label="a dense table">
        <TableBody>
            <TableRow>
                <PaddedCell component="th" scope="row">
                    <code style={{borderRadius: '10px', padding: '0.3rem', fontSize: '0.75rem', background: '#aed1f5e0'}}>enter</code>
                </PaddedCell>
                <PaddedCell>End Length Measurement</PaddedCell>
            </TableRow>
            <TableRow>
                <PaddedCell component="th" scope="row">
                <code style={{borderRadius: '10px', padding: '0.3rem', fontSize: '0.75rem', background: '#fdb7d1e0'}}>backspace</code>
                </PaddedCell>
                <PaddedCell>Remove Selected Object</PaddedCell>
            </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}