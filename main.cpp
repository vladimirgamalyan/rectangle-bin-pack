#include <node.h>
//#include <vector>
#include "MaxRectsBinPack.h"

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

	std::vector<rbp::RectSize> rects;

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

		rbp::RectSize r;
		r.width = static_cast<int>(width);
		r.height = static_cast<int>(height);
		r.tag = static_cast<int>(i);
		rects.push_back(r);
	}

	if (rects.size()) {
		rbp::MaxRectsBinPack mrbp(2048, 2048);
		std::vector<rbp::Rect> readyRects;
		size_t origSize = rects.size();
		mrbp.Insert(rects, readyRects, rbp::MaxRectsBinPack::RectBestAreaFit);
		if (readyRects.size() != origSize) {
			isolate->ThrowException(Exception::TypeError(
				String::NewFromUtf8(isolate, "Internal error")));
			return;
		}

		for (uint32_t i = 0; i < origSize; ++i) {
			const rbp::Rect& r = readyRects[i];
			Local<Object> obj = arr->Get(r.tag)->ToObject();
			obj->Set(String::NewFromUtf8(isolate, "x"), Uint32::New(isolate, r.x));
			obj->Set(String::NewFromUtf8(isolate, "y"), Uint32::New(isolate, r.y));
		}
	}
}

void init(Local<Object> exports) {
	NODE_SET_METHOD(exports, "solve", Solve);
}

NODE_MODULE(rectangle_bin_pack, init)
