from .models import task_state

def map_task_state_to_id(data):
    state_txt = data.pop('state')
    for state in task_state:
        id, txt = state
        if txt == state_txt:
            state_id = id
    return state_id
