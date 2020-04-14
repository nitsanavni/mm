#!/usr/bin/env ruby

# Usage:
# - Start new mindmap:
#   `ruby ttymindmap.rb`
# - Open Freemind format MM mindmap:
#   `ruby ttymindmap.rb <PATH-TO-MM-FILE>`
#
# Press `h` key when running for help.

require 'nokogiri'

# Individual node type
class Node

  protected

  attr_accessor :parent

  public

  attr_accessor :name, :open
  attr_reader :children, :parent

  def initialize(name = 'untitled')
    @name = name
    @children = []
    @parent = nil
    @open = true
  end

  def []=(child)
    @children.push(child)
    child.parent = self
  end

  def [](i)
    @children[i]
  end

  def toggle!
    @open = !@open
  end

  def >>(n = 1)
    return nil if @parent.nil?

    idx = @parent.children.index(self)
    return nil if idx.nil?

    @parent[(idx + n) % @parent.children.length]
  end

  def <<(n = 1)
    self >> -n
  end

  def remove
    @parent.children.delete(self) unless @parent.nil?
  end

  def children?
    !@children.empty?
  end

end

# Proper output of a tree
module PrettyPrint
  def self.tree(subtree, current, indent = 0)
    print ' ' * indent
    print subtree == current ? '>' : '-'
    print subtree.open ? '   ' : (subtree.children.any? ? (subtree.children.length() < 10 ? '+' + subtree.children.length().to_s + ' ' : '+  ') : '   ')
    print subtree.name + "\n"

    return unless subtree.open
    subtree.children.each do |child|
      tree(child, current, indent + 4)
    end
  end
end

def print_help
  puts '= Commands ='
  puts ''
  puts '- Navigation -'
  puts 'd: go to children node'
  puts 'a: go to parent node'
  puts 'w: previous sibling'
  puts 's: next sibling'
  puts ''
  puts '- Action -'
  puts 'c: create child node'
  puts 'r: remove node'
  puts ''
  puts '- Misc -'
  puts 't: toggle'
  puts '[press a key to continue]'
  read_command
end

def read_mm(file_path)
  xml = Nokogiri::XML(IO.read(file_path))
  map_root = xml.xpath('/map/node')[0]
  root = Node.new(map_root['TEXT'])
  read_mm_subtree(root, map_root)
  root
end

def read_mm_subtree(node, xml)
  xml.xpath('node').each do |xml_child|
    node_child = Node.new(xml_child['TEXT'])
    node[] = node_child
    read_mm_subtree(node_child, xml_child)
  end
end

def read_command
  system("stty raw -echo") #=> Raw mode, no echo
  char = STDIN.getc
  system("stty -raw echo") #=> Reset terminal mode
  char
end

if ARGV.empty?
  print 'Mindmap name: '
  current = root = Node.new(STDIN.gets.chomp)
else
  current = root = read_mm(ARGV[0])
end

loop do
  print `clear`
  PrettyPrint.tree(root, current)

  cmd = read_command

  if cmd == 'c'
    print 'Title: '
    current[] = Node.new(STDIN.gets.chomp)
  elsif cmd == 'd'
    current = current[0] if current.children?
  elsif cmd == 'r'
    current.remove
    current = current.parent unless current.parent.nil?
  elsif cmd == 's'
    sibling = current >> 1
    current = sibling unless sibling.nil?
  elsif cmd == 'w'
    sibling = current >> -1
    current = sibling unless sibling.nil?
  elsif cmd == 'r'
    current = root
  elsif cmd == 't'
    current.toggle!
  elsif cmd == 'a'
    current = current.parent unless current.parent.nil?
  elsif cmd == 'h'
    print_help
  elsif cmd == 'q'
    puts 'Good Bye!'
    break
  end
end
