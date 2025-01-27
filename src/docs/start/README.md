# Getting Started

Following is a list of useful graph manipulation features.

# Table of Contents

1. [Search](#search)
2. [Connect](#connect)
3. [Create Data](#create-data)
4. [Add Mode](#add-mode)
5. [Info Mode](#info-mode)
6. [Data Mode](#data-mode)
7. [Remove Mode](#remove-mode)
8. [Change Mode](#change-mode)
9. [Graph | Tree View](#graph--tree-view)
10. [Fullwindow](#fullwindow)
11. [Unlock | Lock Component](#unlock--lock-component)
12. [Minimap](#minimap)
13. [Drawing](#drawing)
14. [Composition](#composition)
15. [Enter | Leave Graph](#enter--leave-graph)
16. [Undo | Redo](#undo--redo)
17. [Save | Load](#save--load)

## Search

To start Search you can either focus on the Search Input or press key <kbd>;</kbd> (semicolon).

You can filter the list by typing on the input box.

To add the selected unit either press on the green unit, or the selected search item, or press key <kbd>Enter</kbd>.

![](/public/gif/start/1.gif)

## Connect

To connect (also merge) two compatible pins, click on a pin, then click on a compatible target pin.

The compatible pins will be highlighted in green.

![](/public/gif/start/2.gif)

Alternatively, you can also drag and drop a node onto a another compatible node.

![](/public/gif/start/17.gif)

![](/public/gif/start/46.gif)

## Create Data

To start editing a new empty datum, double click on the editor background, then start typing.

![](/public/gif/start/14.gif)

You can write any JSON compatible type, including arrays and objects.

![](/public/gif/start/15.gif)

Drag and Drop a datum to a compatible input pin to activate it.

![](/public/gif/start/30.gif)

## Add Mode

To enter Add Mode (also Green Mode) you can either click on the "plus sign" mode button or press key <kbd>S</kbd>.

In Add Mode, it is possible to copy a unit (or the currently Selected Subgraph).

A unit can be shallow cloned with a Green Drag and Drop:

![](/public/gif/start/9.gif)

![](/public/gif/start/18.gif)

Green Click on a unit will Copy To Clipboard. Then Green Double Click on the background will paste whatever is on the Clipboard.

![](/public/gif/start/11.gif)

## Info Mode

To enter Info Mode you can either click on the "lines" mode button or press key <kbd>Q</kbd>.

It will show you documentation about a unit, such as its type, pin types and description.

![](/public/gif/start/22.gif)

Info Click on an editable unit name to rename.

![](/public/gif/start/27.gif)

If you "get inside" a graph on Info Mode, edits to the graph will be reflected on all instances of that class.

## Data Mode

To enter Data Mode (also Chartreuse/Yellow Mode) you can either click on the "triangle" mode button or press key <kbd>A</kbd>.

In Data Mode, double click on the background to add a random datum. If you click on an input, the system will attempt suggest a suitable compatible random datum.

![](/public/gif/start/23.gif)

Yellow Dragging a unit will create a deep copy of it, with the same current state.

![](/public/gif/start/24.gif)

Yellow Long Press on a unit class datum will instantiate it.

![](/public/gif/start/52.gif)

Searching while on Data Mode will switch to adding unit classes instead.

![](/public/gif/start/53.gif)

## Remove Mode

To enter Remove Mode (Red Mode) you can either click on the "x" mode button or press key <kbd>D</kbd>.

Clicking on any node (unit, datum, etc.) will cut that node out, effectively deactivating, removing it from the graph, and adding to the Clipboard.

![](/public/gif/start/5.gif)

This also useful as a quick manual way of deleting data iteratively.

![](/public/gif/start/37.gif)

Many nodes can be removed with Multiselection.

## Change Mode

To enter Change Mode (Blue Mode) you can either click on the "z" mode button or press key <kbd>F</kbd>.

![](/public/gif/start/8.gif)

In Change Mode, clicking on an input or output will set it to constant or not.

![](/public/gif/start/25.gif)

> [!NOTE]
> When saving the current graph, only data in constant inputs will be persisted.

## Graph | Tree View

To switch between Graph View or Tree View, click on the "circle or square" toggle close to the Search.

![](/public/gif/start/20.gif)

This view will show only components, which can composed and reordered into a parent-children tree structure, making it possible to build any type of visual layout.

Search will only show component units.

![](/public/gif/start/21.gif)

To append children to a parent, enter multiselection mode, select the children, then long press on the parent:

![](/public/gif/start/39.gif)

Reversely, to remove all children from parent, enter multiselection mode, then select and long press on the parent:

![](/public/gif/start/40.gif)

## Fullwindow

To go Fullwindow you can press the "transcend" button, usually located at the top.

This will remove the editing GUI and show the final rendering of the graph. This is more interesting when there are components around, so you can see how that unit would look like as a website.

![](/public/gif/start/0.gif)

The components that will go fullwindow are dependent on the context. This enables many layout combinations out of shelf.

![](/public/gif/start/10.gif)

## Resize Component

A component can be resized when it is either selected or unlocked. To resize, pull from one of the components sides or edges.

![](/public/gif/start/19.gif)

## Unlock | Lock Component

To unlock a component unit, Double Click on it.

![](/public/gif/start/16.gif)

## Minimap

To open or close the minimap drawer, click on the "graph" knob, or press <kbd>M</kbd>.

The minimap is useful for navigating the entirety of the graph, especially on small screens.

![](/public/gif/start/41.gif)

## Drawing

To start Drawing do a Click + Long Press (also known as Click and Hold) or press Alt.

Draw a line from center to the outside to create an output plug. Inversely, draw a line from the outside to the center to create an input plug.

![](/public/gif/start/31.gif)

Draw a circle to create an empty unit. Draw a rectangle to create an empty unit that is a component.

![](/public/gif/start/33.gif)

Drawing a contour around a group of nodes, will compose those nodes.

![](/public/gif/start/42.gif)

## Composition

To compose a subgraph into a new unit, on Multiselect Mode, select a subgraph and do Long Press on the background.

![](/public/gif/start/34.gif)

Reversely, on Multiselect Mode, a selected graph can be exploded by a Long Press.

![](/public/gif/start/35.gif)

## Enter | Leave Graph

To enter a graph unit, Long Click on it. To leave, Long Click on the background.

![](/public/gif/start/26.gif)

You can edit a unit from inside.

![](/public/gif/start/32.gif)

## Undo | Redo

To undo last action, press <kbd>Ctrl + Z</kbd>. To redo, press <kbd>Ctrl + Shift + Z</kbd>.

![](/public/gif/start/38.gif)

## Transcend

Pulling up the top "transcend" button will wrap the current graph in an editor.

![](/public/gif/start/51.gif)

This is useful for saving your current workspace as part of a new graph.

## Save | Load

To save a graph, you can press <kbd>Ctrl + S</kbd> or open the "share" drawer and click on the "export" button.

![](/public/gif/start/43.gif)

To open a graph file, you can press <kbd>Ctrl + O</kbd> or press on the "import" button.

![](/public/gif/start/44.gif)

You can also drag and drop a .unit file to the editor to open it.

![](/public/gif/start/45.gif)

![](/public/gif/start/47.gif)

The opened/dropped unit bundle will be injected into the system and will visible on Search.

If all instances of an injected unit are deleted, the unit spec will be deleted from the system.

## Drag and Drop Folder

Drag and drop a folder into the editor to inject all the specs inside into the system.

![](/public/gif/start/48.gif)

The injected specs can't be deleted.
