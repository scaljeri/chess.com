import os 
import sys
import chess
import chess.polyglot

# fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 0'

#if len(sys.argv) >= 2:
#    fen = ' '.join(sys.argv[1:])

dir_path = os.path.dirname(os.path.realpath(__file__))
book_path = dir_path + '/../bins/book.bin'

#board = chess.Board(fen)
# print(board)

reader = chess.polyglot.open_reader(book_path)
# n = sum(1 for _ in reader.find_all(board))

#for entry in reader.find_all(board):
#	print(entry.move, entry.weight, entry.learn)
#print('_')

import sys

lines = []

while True:
    line = sys.stdin.readline()
    if not line:
        break
    line = line.rstrip()
    # sys.stdout.write(line + '\n')
    # lines.append(line)
    board = chess.Board(line)
    for entry in reader.find_all(board):
	    print(entry.move, entry.weight, entry.learn)
	    # sys.stdout.write(entry.move + ' ' + entry.weight + ' ' +  entry.learn + '\n')
    print('_')
    sys.stdout.flush()
