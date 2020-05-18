import React, { Component, Fragment } from 'react';

import { StyleSheet, View, Text, Alert } from 'react-native';

import params from './src/params';

import MineField from './src/components/MineField';

import Header from './src/components/Header';

import LevelSelection from './src/screens/LevelSelection';

import { 
  createMinedBoard, 
  cloneBoard, 
  openField, 
  hasExplosion, 
  winGame, 
  showMines,
  invertFlag,
  flagsUsed 
} from './src/functions';

export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = this.createState();
  }

  minesAmount = () => {
    const cols = params.getColumnsAmount();

    const rows = params.getRowsAmount();

    return Math.ceil(cols * rows * params.difficultLevel);
  }

  createState = () => {
    const cols = params.getColumnsAmount();

    const rows = params.getRowsAmount();

    return { 
      board: createMinedBoard(rows, cols, this.minesAmount()),
      win: false,
      lost: false, 
      showLevelSelection: false,
    }
  }

  onOpenField = (row, column) => {
    const board = cloneBoard(this.state.board);
    openField(board, row, column);
    const lost = hasExplosion(board);
    const win = winGame(board);

    if (lost) {
      showMines(board);
      Alert.alert('Você Perdeu!', 'Jogo desenvolvido por Lucas Bercê de Jesus');
    }

    if (win) {
      Alert.alert('Parabéns você ganhou!', 'Jogo desenvolvido por Lucas Bercê de Jesus');
    }

    this.setState({ board, lost, win });
  }

  onSelectField = (row, column) => {
    const board = cloneBoard(this.state.board);
    invertFlag(board, row, column);
    const win = winGame(board);

    if (win) {
      Alert.alert('Parabéns você ganhou!', 'Jogo desenvolvido por Lucas Bercê de Jesus');
    }

    this.setState({ board, win });
  }

  onLevelSelected = level => {
    params.difficultLevel = level;
    this.setState(this.createState());
  }

  render() {
    return (
        <View style={styles.container}>
          <LevelSelection isVisible={this.state.showLevelSelection} 
            onLevelSelected={this.onLevelSelected} 
            onCancel={() => this.setState({ showLevelSelection: false })}/>
          <Header flagsLeft={this.minesAmount() - flagsUsed(this.state.board)} 
            onNewGame={() => this.setState(this.createState())}
            onFlagPress={() => this.setState({ showLevelSelection: true })} />
          <View style={styles.board}>
            <MineField board={this.state.board} 
              onOpenField={this.onOpenField} 
              onSelectField={this.onSelectField} />
          </View>
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },

  board: {
    alignItems: 'center',
    backgroundColor: '#AAA',
  }
});