#include <node.h>

using namespace v8;

void Solve(const FunctionCallbackInfo<Value>& args) {
	Isolate* isolate = args.GetIsolate();

	if (args.Length() < 1) {
		isolate->ThrowException(Exception::TypeError(
			String::NewFromUtf8(isolate, "Wrong number of arguments")));
		return;
	}

	if (!args[0]->IsArray()) {
		isolate->ThrowException(Exception::TypeError(
			String::NewFromUtf8(isolate, "Wrong arguments")));
		return;
	}
	Local<Array> arr = Local<Array>::Cast(args[0]);
	uint32_t len = arr->Length();

	for (uint32_t i = 0; i < len; ++i) {
		Local<Value> item = arr->Get(i);
		if (!item->IsObject()) {
			isolate->ThrowException(Exception::TypeError(
				String::NewFromUtf8(isolate, "Wrong arguments")));
			return;
		}
		Local<Object> obj = item->ToObject();
		Local<Value> w = obj->Get(String::NewFromUtf8(isolate, "w"));
		Local<Value> h = obj->Get(String::NewFromUtf8(isolate, "h"));

		// 0..0xffffffff only
		if ((!w->IsUint32()) || (!h->IsUint32())) {
			isolate->ThrowException(Exception::TypeError(
				String::NewFromUtf8(isolate, "Wrong arguments")));
			return;
		}
		uint32_t width = w->Uint32Value();
		uint32_t height = h->Uint32Value();

		if ((!width) || (!height) || (width > 0xffff) || (height > 0xffff)) {
			isolate->ThrowException(Exception::TypeError(
				String::NewFromUtf8(isolate, "Wrong arguments")));
			return;
		}

		uint32_t x = 0;
		uint32_t y = 0;

		obj->Set(String::NewFromUtf8(isolate, "x"), Uint32::New(isolate, x));
		obj->Set(String::NewFromUtf8(isolate, "y"), Uint32::New(isolate, y));
	}
}

void init(Local<Object> exports) {
	NODE_SET_METHOD(exports, "solve", Solve);
}

NODE_MODULE(rectangle_bin_pack, init)
