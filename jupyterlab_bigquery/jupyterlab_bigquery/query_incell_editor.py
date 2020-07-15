from ipywidgets import DOMWidget
from traitlets import Unicode, Any
from IPython.core import magic_arguments
import IPython

# TODO: refactor name and version to sync with front 
module_name = 'bigQuery-query-incell-editor'
module_version = '0.0.1'

class QueryIncellEditor(DOMWidget):
  _model_name = Unicode('QueryIncellEditorModel').tag(sync=True)
  _model_module = Unicode(module_name).tag(sync=True)
  _model_module_version = Unicode(module_version).tag(sync=True)
  _view_name = Unicode('QueryIncellEditorView').tag(sync=True)
  _view_module = Unicode(module_name).tag(sync=True)
  _view_module_version = Unicode(module_version).tag(sync=True)

  query = Any().tag(sync=True)
  result = Any().tag(sync=True)

  callback = None

  def __init__(self, **kwargs):
    super().__init__(**kwargs)
    print("A")
    self.observe(self.handleUpdate)

  def handleUpdate(owner, old, new, name):
    print(name)
    print("B")
    if callback is not None:
      print("C")
      self.callback(name, new)

@magic_arguments.magic_arguments()
@magic_arguments.argument(
    "destination_var",
    nargs="?",
    help=("If provided, save the output to this variable instead of displaying it."),
)
def _cell_magic(line, query=None):
  args = magic_arguments.parse_argstring(_cell_magic, line)

  def update(name, new_val):
    print(name)
    print(new_val)
    if name == 'query':
      IPython.get_ipython().push({args.destination_var: new_val})

  e = QueryIncellEditor()
  e.handleUpdate = update
  print('line', line)
  print('cell', query)
  print(e.query)
  print(e.result)
  return e